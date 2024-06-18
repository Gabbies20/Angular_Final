import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AusenciaService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1'; // Cambia esto a tu URL de la API

  constructor(private http: HttpClient, private authService: AuthService) { }

  obtenerAsignaturas(fecha: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No se encontró el token de acceso en localStorage.');
      throw new Error('No se encontró el token de acceso en localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get(`${this.apiUrl}/profesor/asignaturas/`, { headers, params });
  }

  crearAusencia(data: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No se encontró el token de acceso en localStorage.');
      throw new Error('No se encontró el token de acceso en localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/ausencia/crear`, data, { headers });
  }

  obtenerProfesores(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No se encontró el token de acceso en localStorage.');
      throw new Error('No se encontró el token de acceso en localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/profesores/`, { headers });
  }
}



