import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// This is the shape of the login response
interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'access_token';

  private http = inject(HttpClient);

  /**
   * Logs in the user, saves the token, and returns the response.
   */
  login(credentials: { email: string; pass: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.setToken(response.access_token);
        })
      );
  }

  /**
   * Logs out the user by clearing the token.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Saves the JWT to localStorage.
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Retrieves the JWT from localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Checks if a user is currently logged in.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
    // A more advanced check would decode the token
    // and check its expiration date.
  }
}
