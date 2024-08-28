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
        if (res.role === 'Admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/add-document']);
        }
      },
      err => {
        Swal.fire('Error', 'Invalid credentials', 'error');
      }
    );
  }
}
