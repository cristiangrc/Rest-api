import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-login',
  standalone: true, // Marca como standalone
  imports: [ReactiveFormsModule, CommonModule], // Importa ReactiveFormsModule y CommonModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          // Asumiendo un inicio de sesión exitoso, navega a una ruta protegida (ej., tareas)
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = error.error.error || 'Error al iniciar sesión';
          console.error('Error de login:', error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, ingrese su usuario y contraseña.';
    }
  }
}
