import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-register',
  standalone: true, // Marca como standalone
  imports: [ReactiveFormsModule, CommonModule], // Importa ReactiveFormsModule y CommonModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Registro exitoso. Ahora puedes iniciar sesión.';
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = error.error.error || 'Error en el registro';
          console.error('Error de registro:', error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos y asegúrese de que el correo electrónico sea válido y la contraseña tenga al menos 6 caracteres.';
    }
  }
}