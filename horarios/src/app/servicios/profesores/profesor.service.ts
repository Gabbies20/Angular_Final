import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ProfesorService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1/profesores/';

  private apiBusqueda = 'http://127.0.0.1:8000/api/v1/profesor';

  constructor(private http: HttpClient) {}

  getAllProfesores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProfesores(page: number, size: number): Observable<any[]> {
    const url = `${this.apiUrl}?page=${page}&size=${size}`;
    return this.http.get<any[]>(url);
  }

  searchProfesor(profesorCod: string): Observable<any[]> {
    const url = `${this.apiBusqueda}/${profesorCod}`;
    return this.http.get<any[]>(url);
  }
}