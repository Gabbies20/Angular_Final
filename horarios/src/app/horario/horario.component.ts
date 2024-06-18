import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../servicios/horarios/horarios.service';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-horario',
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
    DialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})


export class HorarioComponent implements OnInit {
  horarios: any[] = [];
  loading: boolean = true;
  grupoCod: string = '';
  diasSemana = ['L', 'M', 'X', 'J', 'V'];
  franjas: string[] = [
    '08:15 a 09:15', '09:15 a 10:15', '10:15 a 11:15', '11:45 a 12:45', 
    '12:45 a 13:45', '13:45 a 14:45'
  ];

  constructor(private horarioService: HorariosService) {}

  ngOnInit() {}

  buscarHorarios() {
    this.loading = true;
    this.horarioService.getHorariosPorGrupo(this.grupoCod).subscribe(
      (data) => {
        this.horarios = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.loading = false;
      }
    );
  }

  obtenerHorario(dia: string, franja: string) {
    const horario = this.horarios.find(h => h.dia === dia && h.franja === franja);
    return horario ? horario.asignatura : '';
  }
}