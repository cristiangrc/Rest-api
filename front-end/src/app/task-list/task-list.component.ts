import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  errorMessage: string | null = null;
  private apiUrl = 'http://localhost:3002/api/tasks'; // Ajusta a tu API de tareas del backend

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'Error al cargar las tareas';
        console.error('Error al cargar tareas:', error);
        if (error.status === 401 || error.status === 403) {
          this.authService.logout(); // Limpiar token inválido
          this.router.navigate(['/login']); // Redirigir al inicio de sesión
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
