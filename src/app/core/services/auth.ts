import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.getUserData(firebaseUser.uid);
        this.currentUserSubject.next(userData);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const credential = await signInWithEmailAndPassword(
        this.auth, email, password
      );
      const userData = await this.getUserData(credential.user.uid);
      this.currentUserSubject.next(userData);
      return userData;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'teacher' | 'student'
  ): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(
        this.auth, email, password
      );
      const newUser: User = {
        id: credential.user.uid,
        email, name, role
      };
      await setDoc(
        doc(this.firestore, 'users', credential.user.uid),
        newUser
      );
      this.currentUserSubject.next(newUser);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private async getUserData(uid: string): Promise<User> {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    return userDoc.data() as User;
  }

  private handleError(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-credential':
        return 'Incorrect email or password';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email format';
      default:
        return 'An error occurred. Please try again';
    }
  }
}