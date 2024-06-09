import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProfesorComponent } from '../../profesor/profesor.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet,RouterLink,ProfesorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
