import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, getDoc, DocumentData } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.initializeAuthListener();
  }

  /**
   * Inicializa el listener de cambios de autenticación
   */
  private initializeAuthListener(): void {
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Usuario está autenticado, obtener datos de Firestore
        await this.loadUserFromFirestore(firebaseUser.uid);
      } else {
        // Usuario no autenticado
        this.currentUserSubject.next(null);
      }
      this.isLoadingSubject.next(false);
    });
  }

  /**
   * Carga datos del usuario desde Firestore
   */
  private async loadUserFromFirestore(uid: string): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as DocumentData;
        const user: User = {
          id: uid,
          email: userData['email'] || '',
          name: userData['name'] || '',
          role: userData['role'] || 'student'
        };
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading user from Firestore:', error);
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(email: string, password: string, name: string, role: 'student' | 'teacher'): Promise<User> {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      // Crear documento en Firestore
      const userDocRef = doc(this.firestore, 'users', uid);
      const userData: User = {
        id: uid,
        email,
        name,
        role
      };

      await setDoc(userDocRef, userData);

      // Actualizar el subject
      this.currentUserSubject.next(userData);

      return userData;
    } catch (error: any) {
      throw new Error(this.handleAuthError(error.code));
    }
  }

  /**
   * Iniciar sesión
   */
  async login(email: string, password: string): Promise<User> {
    try {
      this.isLoadingSubject.next(true);
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      await this.loadUserFromFirestore(userCredential.user.uid);

      const currentUser = this.currentUserSubject.value;
      if (!currentUser) {
        throw new Error('No se pudo cargar los datos del usuario');
      }

      return currentUser;
    } catch (error: any) {
      throw new Error(this.handleAuthError(error.code));
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Obtener el rol del usuario actual
   */
  getUserRole(): 'student' | 'teacher' | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  /**
   * Manejo de errores de autenticación
   */
  private handleAuthError(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'El email ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde';
      default:
        return 'Error de autenticación. Intenta nuevamente';
    }
  }
}
