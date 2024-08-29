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
  login(username: string, password: string): Observable<any> {
    const role = username.toLowerCase() === 'admin' ? 'admin' : 'section'; // Set role based on username
    
    const loginPayload = {
      userId: 0,
      username: username,
      passwordHash: password,
      role: role // Assigning role dynamically
    };
  
    return this.http.post<any>(`${this.apiUrl}/login`, loginPayload).pipe(
      map(response => {
        console.log('API response:', response);
        if (response.message === 'Login successful') {
          // Save the user role to localStorage for further use
          localStorage.setItem('userRole', response.role);
          return response; // Returning the full response including the role
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
}
