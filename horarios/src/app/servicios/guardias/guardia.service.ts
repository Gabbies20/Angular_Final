import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../autenticacion/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardiaService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1'; // Cambia esto a tu URL de la API

  constructor(private http: HttpClient, private authService: AuthService) {}

  obtenerGuardias(fecha: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No se encontró el token de acceso en localStorage.');
      throw new Error('No se encontró el token de acceso en localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/guardias/?fecha=${fecha}`, { headers });
  }

  obtenerAusencias(fecha: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No se encontró el token de acceso en localStorage.');
      throw new Error('No se encontró el token de acceso en localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/ausencias/?fecha=${fecha}`, { headers });
  }

  enviarPDFCorreo(pdfData: Blob, email: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No se encontró el token de acceso en localStorage.');
      throw new Error('No se encontró el token de acceso en localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const formData = new FormData();
    formData.append('pdf', pdfData);
    formData.append('email', email);
    return this.http.post(`${this.apiUrl}/enviar-pdf/`, formData, { headers });
  }

}
