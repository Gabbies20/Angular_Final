import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { ProfesorComponent } from './profesor/profesor.component';
import { HorarioComponent } from './horario/horario.component';
import { AsignaturaComponent } from './asignatura/asignatura.component';
import { AusenciaComponent } from './ausencia/ausencia.component';
import { GuardiaComponent } from './guardia/guardia.component';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [
    {path:'login',component:LoginComponent},
    {path:'profesores',component:ProfesorComponent},
    {path:'horarios',component:HorarioComponent},
    {path:'asignaturas',component:AsignaturaComponent},
    {path:'ausencias',component:AusenciaComponent},
    {path:'guardias',component:GuardiaComponent},
    {path:'registrar',component:RegistroComponent},
    {path:'**', redirectTo:'login'}
];
