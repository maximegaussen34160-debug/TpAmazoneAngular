import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap, throwError, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HashService } from '../hash';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  pass: string;
  salt: string;
}

export interface SaltResponse {
  salt: string;
}

export interface AuthResponse {
  token?: string;
  userId?: number | string;
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'USER';
  expiresIn?: number;
}

export interface RegisterResponse {
  id?: number;
  name?: string;
  email?: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly STORAGE_KEY = 'currentUser';
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly hashService: HashService
  ) {}

  private loadUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Récupère un nouveau salt (pour inscription ou reset password)
   * GET /salt → { salt }
   */
  getNewSalt(): Observable<SaltResponse> {
    return this.http.get<SaltResponse>(`${this.baseUrl}/salt`);
  }

  /**
   * Récupère le salt d'un utilisateur (pour login)
   * GET /salt?email=... → { salt }
   */
  getSaltByEmail(email: string): Observable<SaltResponse> {
    return this.http.get<SaltResponse>(`${this.baseUrl}/salt?email=${encodeURIComponent(email)}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return throwError(() => new Error('Compte inexistant'));
        }
        return throwError(() => new Error('Compte inexistant'));
      })
    );
  }

  /**
   * Login en 2 étapes :
   * 1. GET /salt?email=... pour récupérer le salt
   * 2. POST /login avec hash(password + salt)
   */
  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.getSaltByEmail(payload.email).pipe(
      switchMap((saltResponse) => {
        // Hash le password + salt côté client (le serveur ajoutera le pepper)
        const hashedPassword = this.hashService.hash(payload.password + saltResponse.salt);
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, {
          email: payload.email,
          password: hashedPassword
        });
      }),
      tap((response) => {
        const user: User = {
          id: typeof response.userId === 'string' ? parseInt(response.userId, 10) : response.userId,
          name: response.name || payload.email.split('@')[0],
          email: payload.email,
          role: response.role || 'USER',
          token: response.token
        };
        this.saveUserToStorage(user);
        this.currentUserSubject.next(user);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => new Error('Email ou mot de passe incorrect'));
        }
        if (error.status === 404) {
          return throwError(() => new Error('Compte inexistant'));
        }
        if (error instanceof Error) {
          return throwError(() => error);
        }
        return throwError(() => new Error('Compte inexistant'));
      })
    );
  }

  /**
   * Register en 2 étapes :
   * 1. GET /salt pour récupérer un nouveau salt
   * 2. POST /user avec { name, email, pass: hash(password + salt), salt }
   */
  register(payload: { name: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.getNewSalt().pipe(
      switchMap((saltResponse) => {
        // Hash le password + salt côté client
        const hashedPassword = this.hashService.hash(payload.password + saltResponse.salt);
        return this.http.post<RegisterResponse>(`${this.baseUrl}/user`, {
          name: payload.name,
          email: payload.email,
          pass: hashedPassword,
          salt: saltResponse.salt
        });
      })
    );
  }

  /**
   * Mot de passe oublié - Étape 1 : Demander un code
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/forgot-password`, { email });
  }

  /**
   * Mot de passe oublié - Étape 2 : Vérifier le code
   */
  verifyResetCode(email: string, code: string): Observable<{ valid: boolean }> {
    return this.http.post<{ valid: boolean }>(`${this.baseUrl}/verify-reset-code`, { email, code });
  }

  /**
   * Mot de passe oublié - Étape 3 : Réinitialiser avec nouveau mot de passe
   */
  resetPassword(email: string, code: string, newPassword: string): Observable<{ message: string }> {
    return this.getNewSalt().pipe(
      switchMap((saltResponse) => {
        const hashedPassword = this.hashService.hash(newPassword + saltResponse.salt);
        return this.http.post<{ message: string }>(`${this.baseUrl}/reset-password`, {
          email,
          code,
          newPassword: hashedPassword,
          salt: saltResponse.salt
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'ADMIN';
  }

  updateCurrentUserRole(role: 'ADMIN' | 'USER'): void {
    const user = this.currentUserSubject.value;
    if (user) {
      user.role = role;
      this.saveUserToStorage(user);
      this.currentUserSubject.next({ ...user });
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
