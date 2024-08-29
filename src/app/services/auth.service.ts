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

  // Login method to authenticate the user
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
        // Return true if login is successful, false otherwise
        return response.message === 'Login successful';
      }),
      catchError(error => {
        console.error('Login error', error);
        return of(false);
      })
    );
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');  // Simplified check using localStorage
  }

  // Method to log out the user
  logout(): Observable<void> {
    localStorage.removeItem('user');  // Remove user data from localStorage
    console.log('User logged out');
    return of();  // Observable that completes immediately
  }
}
