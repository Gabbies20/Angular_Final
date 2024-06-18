import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root'
})


// export class ProfesorService {

//   private apiUrl = 'http://127.0.0.1:8000/api/v1/profesores/';

//   private apiBusqueda = 'http://127.0.0.1:8000/api/v1/profesor';

//   constructor(private http: HttpClient) {}

//   getAllProfesores(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl);
//   }

//   getProfesores(page: number, size: number): Observable<any[]> {
//     const url = `${this.apiUrl}?page=${page}&size=${size}`;
//     return this.http.get<any[]>(url);
//   }

//   searchProfesor(profesorCod: string): Observable<any[]> {
//     const url = `${this.apiBusqueda}/${profesorCod}`;
//     return this.http.get<any[]>(url);
//   }
// }

export class ProfesorService {
  private baseUrl = 'http://127.0.0.1:8000/api/v1';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllProfesores() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/profesores/`, { headers });
  }

  getHorarios() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/horarios/`, { headers });
  }
}