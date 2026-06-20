import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from './auth.models';

const TOKEN_STORAGE_KEY = 'eventos.auth.token';
const USERNAME_STORAGE_KEY = 'eventos.auth.username';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly tokenSignal = signal<string | null>(this.readStorage(TOKEN_STORAGE_KEY));
  private readonly usernameSignal = signal<string | null>(this.readStorage(USERNAME_STORAGE_KEY));

  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);
  readonly username = this.usernameSignal.asReadonly();

  token(): string | null {
    return this.tokenSignal();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', request).pipe(
      tap((response) => {
        this.tokenSignal.set(response.token);
        this.usernameSignal.set(response.username);
        this.writeStorage(TOKEN_STORAGE_KEY, response.token);
        this.writeStorage(USERNAME_STORAGE_KEY, response.username);
      }),
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.usernameSignal.set(null);
    this.removeStorage(TOKEN_STORAGE_KEY);
    this.removeStorage(USERNAME_STORAGE_KEY);
  }

  // localStorage puede no estar disponible (SSR, navegación privada, sandboxes de test): se ignora en ese caso.
  private readStorage(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeStorage(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  private removeStorage(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* almacenamiento no disponible */
    }
  }
}
