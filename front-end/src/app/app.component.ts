import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Requerido para router-outlet
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-root',
  standalone: true, // Marca como standalone
  imports: [RouterOutlet, CommonModule], // Importa RouterOutlet y CommonModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-end';
}