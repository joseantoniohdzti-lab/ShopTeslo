import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { User, UserResponse } from '@auth/interfaces/user-interfaces';
import { environment } from '../../../environments/environment.development';
import { LoginResponse } from '@products/interfaces/login-interfaces';
import { catchError, firstValueFrom, map, Observable, of, tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

export interface usuario {
  fullName: string;
  password: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _http = inject(HttpClient);
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _urlBase = environment.urlApiBaseTeleshop;

  checkStatusResource = resource({
    loader: async () => {
      const response = await firstValueFrom(this.checkStatus());

      return response;
    },
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') {
      return 'checking';
    }

    if (this._user()) return 'authenticated';

    return 'not-authenticated';
  });

  user = computed<User | null>(() => {
    return this._user();
  });

  token = computed<string | null>(() => this._token());

  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  login(email: string, password: string): Observable<boolean> {
    return this._http
      .post<LoginResponse>(`${this._urlBase}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
          // this._authStatus.set('authenticated');
          // this._user.set(response.user);
          // this._token.set(response.token);

          // localStorage.setItem('token', response.token);
        }),
        map((data) => true),
        catchError((error: any) => {
          // this._token.set(null);
          // this._authStatus.set('not-authenticated');
          console.error('Error HTTP:', error);
          console.error('Respuesta del servidor:', error.error);
          return this.handleAuthError(error);
        }),
      );
  }

  register(user: usuario): Observable<boolean> {
    return this._http.post<UserResponse>(`${this._urlBase}/auth/register`, user).pipe(
      tap((response) => {
        this.handleAuthSuccessRegister(response);
      }),
      map((data) => true),
      catchError((error: any) => this.handleAuthError(error)),
    );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this._http.get<LoginResponse>(`${this._urlBase}/auth/check-status`).pipe(
      tap((response) => {
        this.handleAuthSuccess(response);
      }),
      map((data) => true),
      catchError((error: any) => {
        console.error('Error HTTP:', error);
        console.error('Respuesta del servidor:', error.error);
        return this.handleAuthError(error);
      }),
    );
  }

  logout() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);

    localStorage.removeItem('token');
  }

  private handleAuthSuccess(resp: LoginResponse) {
    this._authStatus.set('authenticated');
    this._user.set(resp.user);
    this._token.set(resp.token);

    localStorage.setItem('token', resp.token);
  }

  private handleAuthSuccessRegister(resp: UserResponse) {
    this._authStatus.set('authenticated');
    this._user.set(resp.user);
    this._token.set(resp.token);

    localStorage.setItem('token', resp.token);
  }

  private handleAuthError(error: any): Observable<boolean> {
    this.logout();
    return of(false);
  }
}
