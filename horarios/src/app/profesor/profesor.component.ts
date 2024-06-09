import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProfesorService } from '../servicios/profesores/profesor.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessagesModule } from 'primeng/messages'; 
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [HeaderComponent, HttpClientModule, CommonModule, TableModule,ButtonModule,InputTextModule,FormsModule,MessagesModule,MessageModule], 
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.css'] 
})

export class ProfesorComponent implements OnInit {

  profesores: any[] = [];
  loading: boolean = true;

  constructor(private servicioProfesores: ProfesorService) {}

  ngOnInit() {
    this.getAllProfesores();
  }

  getAllProfesores() {
    this.loading = true;
    this.servicioProfesores.getAllProfesores().subscribe({
      next: (data: any[]) => {
        console.log('Datos recibidos:', data);
        this.profesores = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
        this.loading = false;
      }
    });
  }

  onAddNew() {
    console.log('Añadir nuevo profesor');
    // Implementa la lógica para añadir un nuevo profesor
  }

  verProfesor(profesor: any) {
    console.log('Ver profesor:', profesor);
  }

  editarProfesor(profesor: any) {
    console.log('Editar profesor:', profesor);
  }

  eliminarProfesor(profesor: any) {
    console.log('Eliminar profesor:', profesor);
  }
}