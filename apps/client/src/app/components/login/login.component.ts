import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  // Use inject() for modern, standalone components
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['admin@test.com', [Validators.required, Validators.email]],
      password: ['password123', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;
    const creds = {
      email: this.loginForm.value.email,
      pass: this.loginForm.value.password, // Send 'pass' to match LocalStrategy
    };

    this.authService.login(creds).subscribe({
      next: () => {
        // On success, navigate to a protected dashboard route
        // We will create this route next
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Invalid email or password. Please try again.';
      },
    });
  }
}
