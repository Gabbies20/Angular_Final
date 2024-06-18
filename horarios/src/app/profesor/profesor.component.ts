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
import { CalendarModule } from 'primeng/calendar';
import { AuthService } from '../servicios/autenticacion/auth.service';
import { HorariosService } from '../servicios/horarios/horarios.service';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [HeaderComponent, HttpClientModule, CommonModule, TableModule,ButtonModule,InputTextModule,FormsModule,MessagesModule,MessageModule,CalendarModule], 
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.css'] 
})

// export class ProfesorComponent implements OnInit {

//   profesores: any[] = [];
//   loading: boolean = true;

//   constructor(private servicioProfesores: ProfesorService) {}

//   ngOnInit() {
//     this.getAllProfesores();
//   }

//   getAllProfesores() {
//     this.loading = true;
//     this.servicioProfesores.getAllProfesores().subscribe({
//       next: (data: any[]) => {
//         console.log('Datos recibidos:', data);
//         this.profesores = data;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Error al obtener datos:', err);
//         this.loading = false;
//       }
//     });
//   }

//   onAddNew() {
//     console.log('Añadir nuevo profesor');
//     // Implementa la lógica para añadir un nuevo profesor
//   }

//   verProfesor(profesor: any) {
//     console.log('Ver profesor:', profesor);
//   }

//   editarProfesor(profesor: any) {
//     console.log('Editar profesor:', profesor);
//   }

//   eliminarProfesor(profesor: any) {
//     console.log('Eliminar profesor:', profesor);
//   }
// }

export class ProfesorComponent implements OnInit {
  currentUser: string | null = null;
  horarios: any[] = [];
  profesores: any[] = [];
  horarioPorFranjaYDia: any = {};
  isAdmin: boolean = false;
  loading: boolean = false;

  franjas: string[] = [
    '08:15 a 09:15',
    '09:15 a 10:15',
    '10:15 a 11:15',
    '11:45 a 12:45',
    '12:45 a 13:45',
    '13:45 a 14:45'
  ];

  dias: string[] = ['L', 'M', 'X', 'J', 'V'];

  constructor(private authService: AuthService, private horariosService: HorariosService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser === 'admin';

    if (!this.isAdmin && this.currentUser) {
      this.loadHorarios(this.currentUser);
    }
  }

  
  loadHorarios(profesorId: string): void {
    this.loading = true;
    this.horariosService.getHorariosProfesor(profesorId).subscribe(
      data => {
        this.horarios = data;
        this.loading = false;
      },
      error => {
        console.error('Error al cargar los horarios', error);
        this.loading = false;
      }
    );
  }

  getHorarioPorFranjaYDia(franja: string, dia: string): any {
    return this.horarios.find(
      horario => horario.franja_cod.descripcion === franja && horario.dia === dia
    );
  }


  loadProfesores(): void {
    // Lógica para cargar la lista de profesores
  }

  verProfesor(profesor: any): void {
    // Lógica para ver detalles del profesor
  }

  editarProfesor(profesor: any): void {
    // Lógica para editar profesor
  }

  eliminarProfesor(profesor: any): void {
    // Lógica para eliminar profesor
  }
}