import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7143/api/Document/login';
  private readonly TOKEN_KEY = 'authToken'; // Key for storing the token in localStorage

  constructor(private http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return of(!!token); // Returns true if token exists, false otherwise
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, passwordHash: password }).pipe(
      map(response => {
        console.log('API response:', response);
        if (response.message === 'Login successful') {
          // Replace 'dummy-token' with actual token if returned
          localStorage.setItem(this.TOKEN_KEY, response.token || 'dummy-token');
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Login error', error);
        return of(false);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): Observable<void> {
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('User logged out');
    return of();
  }
}
