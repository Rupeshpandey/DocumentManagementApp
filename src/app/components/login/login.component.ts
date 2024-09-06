import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

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
    this.authService.login(this.username, this.password).subscribe(
      (res: any) => {
        if (res && res.message === 'Login successful') {
          localStorage.setItem('userId', JSON.stringify(res.userId)); // Convert userId to string for localStorage
          localStorage.setItem('userRole', res.role);  // Store user role

          if (res.role === 'admin') {
            this.router.navigate(['/dashboard']);  // Redirect to Admin Dashboard
          } else if (res.role === 'section') {
            this.router.navigate(['/add-document']);  // Redirect to Section User Document Form
          } else {
            Swal.fire('Error', 'User role not recognized', 'error');
          }
        } else {
          Swal.fire('Error', 'Login failed', 'error');
        }
      },
      err => {
        Swal.fire('Error', 'Invalid credentials', 'error');
      }
    );
  }
}
