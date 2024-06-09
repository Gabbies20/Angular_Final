import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../servicios/horarios/horarios.service';
import { HeaderComponent } from '../header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [HeaderComponent,HttpClientModule,CommonModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})
export class HorarioComponent implements OnInit {

  horarios!: any[];

  constructor(private servicioHorario: HorariosService){}

  ngOnInit(){
    this.getHorarios();
  }


  getHorarios(){
    this.servicioHorario.getHorarios().subscribe(data => this.horarios=data)
  }

}
