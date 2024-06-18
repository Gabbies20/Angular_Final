import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { RegistroService } from '../servicios/registro/registro.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showPassword: boolean = false; // Variable para controlar la visibilidad de la contraseña

  constructor(
    private registroService: RegistroService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\d]*$/)]],
      rol: [2, Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(15)]]
    });
  }

  registrar(): void {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.registroForm.valid) {
      const { username, password, email, rol, nombre } = this.registroForm.value;
      this.registroService.registrarUsuario(username, password, email, rol, nombre).subscribe(
        response => {
          console.log('Usuario registrado:', response);
          this.successMessage = 'Usuario registrado exitosamente.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000); // Redirigir después de 2 segundos
        },
        error => {
          console.error('Error al registrar usuario:', error);
          this.errorMessage = 'Error al registrar usuario.';
        }
      );
    } else {
      this.errorMessage = 'Por favor, corrija los errores en el formulario.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
