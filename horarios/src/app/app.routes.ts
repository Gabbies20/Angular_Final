import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { ProfesorComponent } from './profesor/profesor.component';
import { HorarioComponent } from './horario/horario.component';
import { AsignaturaComponent } from './asignatura/asignatura.component';

export const routes: Routes = [
    {path:'login',component:LoginComponent},
    {path:'profesores',component:ProfesorComponent},
    {path:'horarios',component:HorarioComponent},
    {path:'asignaturas',component:AsignaturaComponent},
    {path:'**', redirectTo:'login'}
];
