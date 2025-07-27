// Para Angular 17+ con componentes standalone
   import { Routes } from '@angular/router';
    import { LoginComponent } from './login/login.component';
    import { RegisterComponent } from './register/register.component';
    import { TaskListComponent } from './task-list/task-list.component';

    export const routes: Routes = [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'tasks', component: TaskListComponent },
      { path: '', redirectTo: '/login', pathMatch: 'full' }, // Esta línea es crucial
      { path: '**', redirectTo: '/login' } // Ruta comodín para cualquier otra ruta
    ];