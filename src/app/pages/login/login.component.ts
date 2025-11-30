import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParseSourceFile } from '@angular/compiler';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorForm: string = '';
  succesForm: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);

    this.apiService.postLogin(this.loginForm.value).subscribe({
      next: (response) => {
        this.errorForm = '';
        console.log('User logged in successfully:', response);
        this.succesForm = true;
        this.authService.login(response);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorForm =
          'Échec de la connexion : email ou mot de passe incorrect.';
      },
    });
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }
  get email() {
    return this.loginForm.get('email') as FormControl;
  }
}
