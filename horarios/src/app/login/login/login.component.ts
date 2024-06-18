import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProfesorComponent } from '../../profesor/profesor.component';
import { AuthService } from '../../servicios/autenticacion/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ProfesorComponent, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    console.log('Formulario de login enviado.');
    this.authService.login(this.username, this.password).subscribe(
      response => this.handleLoginResponse(response),
      error => this.handleLoginError(error)
    );
  }

  handleLoginResponse(response: any): void {
    console.log('Respuesta de autenticación recibida:', response);
    this.authService.obtenerInfoUsuario().subscribe(
      user => {
        if (user.rol === '1') {
          console.log('Redirigiendo al administrador...');
          this.router.navigate(['/asignaturas']);
        } else {
          console.log('Redirigiendo al usuario...');
          this.router.navigate(['/profesores']);
        }
      },
      error => this.handleLoginError(error)
    );
  }

  handleLoginError(error: any): void {
    console.error('Error en el proceso de login:', error);
    alert('Login fallido. Por favor, verifica tus credenciales.');
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}

