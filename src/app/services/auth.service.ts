import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7143/api/Document';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    const loginPayload = {
      userId: 0,           // Default value, modify as necessary
      username: username,
      passwordHash: password,
      role: 'admin'        // Assuming 'admin' role, modify as necessary
    };

    return this.http.post<any>(`${this.apiUrl}/login`, loginPayload).pipe(
      map(response => {
        console.log('API response:', response);
        return response.message === 'Login successful';
      }),
      catchError(error => {
        console.error('Login error', error);
        return of(false);
      })
    );
  }

  isLoggedIn(): boolean {
    return false; // Simplified check without tokens
  }

  logout(): Observable<void> {
    console.log('User logged out');
    return of();
  }
}
