import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth, signOut } from '@angular/fire/auth';
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
      this.saveSession(response.user, response.token);
      return response.user;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error(this.handleHttpError(error));
      }
      throw new Error('Error al iniciar sesión. Intenta nuevamente');
    }
  }

  async register(email: string, password: string, name: string, role: 'student' | 'teacher' | 'admin'): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, password, name, role })
      );
      this.saveSession(response.user, response.token);
      return response.user;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error(this.handleHttpError(error));
      }
      throw new Error('Error al registrarse. Intenta nuevamente');
    }
  }

  async getIdToken(): Promise<string | null> {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private saveSession(user: User, token: string) {
    localStorage.setItem(this.USER_KEY,  JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);
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

  getUserRole(): 'student' | 'teacher' | 'admin' | null {
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
