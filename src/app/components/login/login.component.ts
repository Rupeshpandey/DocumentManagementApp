import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    console.log('Attempting login with:', this.username, this.password);
    this.authService.login(this.username, this.password).subscribe({
      next: (success: boolean) => {
        console.log('Login success:', success);
        if (success) {
          console.log('Navigating to /vendor-registration');
          this.router.navigate(['/vendor-registration']).then(success => {
            console.log('Navigation success:', success);
          }).catch(err => {
            console.error('Navigation error:', err);
          });
        } else {
          alert('Invalid credentials');
        }
      },
      error: (err: any) => {
        console.error('Login error', err);
        alert('An error occurred during login. Please try again later.');
      }
    });
  }
}
