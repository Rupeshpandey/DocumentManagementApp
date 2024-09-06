import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7143/api/Document';  // Update with your actual API URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const loginPayload = {
      userId: 0,  // Default value as required by the API
      username: username,
      passwordHash: password,
      role: username.toLowerCase() === 'admin' ? 'admin' : 'section'
    };

    return this.http.post<any>(`${this.apiUrl}/login`, loginPayload).pipe(
      map(response => {
        if (response && response.message === 'Login successful') {
          if (response.userId !== undefined && response.userId !== null) {
            localStorage.setItem('userId', JSON.stringify(response.userId)); // Convert userId to string for localStorage
          } else {
            console.error('userId is undefined or null in the response');
          }
          localStorage.setItem('userRole', response.role);  // Store user role
          return response; // Returning the full response including the role and user ID
        } else {
          return null;
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        return of(null);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userRole');
  }
}
