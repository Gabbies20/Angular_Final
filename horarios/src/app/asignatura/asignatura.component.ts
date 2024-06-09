import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AsignaturaService } from '../servicios/asignatura/asignatura.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-asignatura',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,
    HttpClientModule,
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    DialogModule
  ],
  templateUrl: './asignatura.component.html',
  styleUrls: ['./asignatura.component.css']
})
export class AsignaturaComponent implements OnInit {
  asignaturas: any[] = [];
  loading: boolean = true;
  codigoAsignatura: string = '';
  noResults: boolean = false;
  editarForm: FormGroup;
  mostrarFormulario: boolean = false;
  mostrarConfirmacion: boolean = false; // Modal de confirmación de eliminación
  mostrarDetallesDialog: boolean = false; // Modal de detalles
  esEdicion: boolean = false; // Variable para distinguir entre edición y adición
  codigoOriginal: string = ''; // Variable para mantener el código original durante la edición
  asignaturaSeleccionada: any = null; // Asignatura seleccionada para eliminación
  asignaturaDetalles: any = null; // Asignatura seleccionada para mostrar detalles

  constructor(private servicioAsignaturas: AsignaturaService, private fb: FormBuilder) {
    this.editarForm = this.fb.group({
      asignatura_cod: [''],
      descripcion: ['']
    });
  }

  ngOnInit() {
    this.getAllAsignaturas();
  }

  getAllAsignaturas() {
    this.loading = true;
    this.servicioAsignaturas.getAllAsignaturas().subscribe({
      next: (data: any[]) => {
        console.log('Datos recibidos:', data);
        this.asignaturas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
        this.loading = false;
      }
    });
  }

  obtenerAsignatura(): void {
    this.loading = true;
    this.noResults = false;
    this.servicioAsignaturas.buscarAsignatura(this.codigoAsignatura).subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.asignaturas = data;
        } else {
          this.asignaturas = [data];
        }
        this.loading = false;
        this.noResults = this.asignaturas.length === 0;
        console.log('Datos obtenidos:', data);
      },
      (error) => {
        this.loading = false;
        this.noResults = true;
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  mostrarFormularioEdicion(asignatura: any): void {
    this.editarForm.patchValue(asignatura);
    this.esEdicion = true; // Modo edición
    this.codigoOriginal = asignatura.asignatura_cod; // Guardar el código original
    this.mostrarFormulario = true;
  }

  mostrarFormularioNuevo(): void {
    this.editarForm.reset();
    this.esEdicion = false; // Modo adición
    this.mostrarFormulario = true;
  }

  guardarAsignatura(): void {
    if (this.esEdicion) {
      // Usar el código original para la solicitud PUT
      this.servicioAsignaturas.editarAsignatura(this.codigoOriginal, this.editarForm.value).subscribe(
        (response) => {
          console.log('Asignatura actualizada:', response);
          this.mostrarFormulario = false;
          this.getAllAsignaturas(); // Actualiza la lista de asignaturas
        },
        (error) => {
          console.error('Error al actualizar la asignatura:', error);
        }
      );
    } else {
      this.servicioAsignaturas.agregarAsignatura(this.editarForm.value).subscribe(
        (response) => {
          console.log('Asignatura añadida:', response);
          this.mostrarFormulario = false;
          this.getAllAsignaturas(); // Actualiza la lista de asignaturas
        },
        (error) => {
          console.error('Error al añadir la asignatura:', error);
        }
      );
    }
  }

  confirmarEliminacion(asignatura: any): void {
    this.asignaturaSeleccionada = asignatura;
    this.mostrarConfirmacion = true;
  }

  eliminarAsignaturaConfirmada(): void {
    if (this.asignaturaSeleccionada) {
      this.servicioAsignaturas.eliminarAsignatura(this.asignaturaSeleccionada.asignatura_cod).subscribe(
        (response) => {
          console.log('Asignatura eliminada:', response);
          this.mostrarConfirmacion = false;
          this.getAllAsignaturas(); // Actualiza la lista de asignaturas
        },
        (error) => {
          console.error('Error al eliminar la asignatura:', error);
        }
      );
    }
  }

  mostrarDetalles(asignatura: any): void {
    this.asignaturaDetalles = asignatura;
    this.mostrarDetallesDialog = true;
  }
}
