import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth, signInWithCustomToken, signOut } from '@angular/fire/auth';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USER_KEY  = 'auth_user';
  private readonly TOKEN_KEY = 'auth_token';

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoading$ = new BehaviorSubject<boolean>(false).asObservable();

  constructor(private http: HttpClient, private firebaseAuth: Auth) {}

  private loadStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      );
      await signInWithCustomToken(this.firebaseAuth, response.token);
      this.saveSession(response.user);
      return response.user;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error(this.handleHttpError(error));
      }
      throw new Error('Error al iniciar sesión. Intenta nuevamente');
    }
  }

  async register(email: string, password: string, name: string, role: 'student' | 'teacher'): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, password, name, role })
      );
      await signInWithCustomToken(this.firebaseAuth, response.token);
      this.saveSession(response.user);
      return response.user;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error(this.handleHttpError(error));
      }
      throw new Error('Error al registrarse. Intenta nuevamente');
    }
  }

  // Devuelve el custom token guardado (el backend lo verifica con jsonwebtoken)
  async getIdToken(): Promise<string | null> {
    const user = this.firebaseAuth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }

  private saveSession(user: User) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
    } catch { /* ignorar */ }
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getUserRole(): 'student' | 'teacher' | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  private handleHttpError(error: HttpErrorResponse): string {
    if (!error.status || error.status === 0) return 'No se puede conectar al servidor';
    if (error.status === 400) return error.error?.error || 'Datos incorrectos';
    if (error.status === 401) return 'Email o contraseña incorrectos';
    if (error.status === 404) return 'Usuario no encontrado';
    if (error.status === 409) return 'El email ya está registrado';
    return error.error?.error || 'Error. Intenta nuevamente';
  }
}
