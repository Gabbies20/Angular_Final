import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {


  private apiUrl = 'http://127.0.0.1:8000/api/v1/horario/';



  constructor(private http: HttpClient) { }

  getHorarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getHorariosPorGrupo(grupoCod: string): Observable<any[]> {
    const url = `${this.apiUrl}grupo/${grupoCod}`;
    return this.http.get<any[]>(url);
  }


  getHorariosProfesor(profesorId: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}profesor/${profesorId}`, { headers });
  }
}
