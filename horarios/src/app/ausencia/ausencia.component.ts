import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AusenciaService } from '../servicios/ausencias/ausencia.service';
import moment from 'moment';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../servicios/autenticacion/auth.service';

@Component({
  selector: 'app-ausencia',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalendarModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    RouterLink,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,HeaderComponent,
    DropdownModule
  ],
  templateUrl: './ausencia.component.html',
  styleUrls: ['./ausencia.component.css']
})

export class AusenciaComponent implements OnInit {
  ausenciaForm: FormGroup = new FormGroup({});
  asignaturas: any[] = [];
  profesores: any[] = [];
  isAdmin: boolean;

  constructor(
    private fb: FormBuilder,
    private ausenciaService: AusenciaService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.ausenciaForm = this.fb.group({
      fecha: ['', Validators.required],
      motivo: ['', Validators.required],
      horarioId: [''],
      diaEntero: [false],
      profesor: [''] // Campo adicional para seleccionar el profesor (solo visible para admin)
    });

    if (!this.isAdmin) {
      this.ausenciaForm.get('fecha')?.valueChanges.subscribe(value => {
        this.onFechaChange(value);
      });
    } else {
      this.cargarProfesores();
    }
  }

  cargarProfesores() {
    this.ausenciaService.obtenerProfesores().subscribe(
      response => {
        this.profesores = response;
      },
      error => {
        console.error('Error al obtener los profesores:', error);
      }
    );
  }

  onFechaChange(fecha: string) {
    const formattedFecha = moment(fecha).format('YYYY-MM-DD');
    console.log(`Fecha formateada enviada: ${formattedFecha}`);
    this.ausenciaService.obtenerAsignaturas(formattedFecha).subscribe(
      response => {
        this.asignaturas = response;
      },
      error => {
        console.error('Error al obtener asignaturas:', error);
      }
    );
  }

  onSubmit() {
    if (this.ausenciaForm.valid) {
      const { fecha, motivo, horarioId, diaEntero, profesor } = this.ausenciaForm.value;
      const formattedFecha = moment(fecha).format('YYYY-MM-DDTHH:mm:ss');

      // Validar que la fecha no sea anterior a la actual
      if (moment(fecha).isBefore(moment(), 'day')) {
        alert('No se puede crear una ausencia en una fecha pasada.');
        return;
      }

      const data: { fecha: string; motivo: any; horario_id: any; dia_entero: any; profesor_cod?: any; } = {
        fecha: formattedFecha,
        motivo,
        horario_id: horarioId,
        dia_entero: diaEntero
      };
      
      if (this.isAdmin) {
        data.profesor_cod = profesor;
      }

      this.ausenciaService.crearAusencia(data).subscribe(
        response => {
          console.log('Ausencia creada:', response);
          alert(`Ausencia creada exitosamente para el profesor: ${response.profesor} en la asignatura: ${response.asignatura} en la franja horaria: ${response.franja}`);
        },
        error => {
          console.error('Error al crear la ausencia:', error);
          alert(`Ya ha creado una fecha para ese día.`);
        }
      );
    }
  }
}