import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParseSourceFile } from '@angular/compiler';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  loginForm: FormGroup;
  errorForm: string = '';
  succesForm: boolean = false;
  forbidenPassword = ['1234', 'azerty', 'qwerty'];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.apiService.postRegistration(this.loginForm.value).subscribe({
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
        this.errorForm = 'Échec de la création du compte';
      },
    });
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }
  get email() {
    return this.loginForm.get('email') as FormControl;
  }
  get username() {
    return this.loginForm.get('username') as FormControl;
  }

  forbidenPasswordValidator = (
    control: FormControl
  ): { forbiden: boolean } | null => {
    if (this.forbidenPassword.includes(control.value)) {
      return { forbiden: true };
    }
    return null;
  };
}
