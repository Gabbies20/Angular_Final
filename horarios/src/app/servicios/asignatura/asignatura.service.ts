import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1/asignaturas/';
  private apiBusqueda = 'http://127.0.0.1:8000/api/v1/asignatura';
  private apiEditar = 'http://127.0.0.1:8000/api/v1/asignaturas/editar';
  private apiCrear = 'http://127.0.0.1:8000/api/v1/asignaturas/crear';
  private apiEliminar = 'http://127.0.0.1:8000/api/v1/asignaturas/eliminar';

  constructor(private http:HttpClient) { }

  
  getAllAsignaturas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarAsignatura(asignaturaCod: string): Observable<any[]> {
    const url = `${this.apiBusqueda}/${asignaturaCod}`;
    return this.http.get<any[]>(url);
  }

  editarAsignatura(asignaturaCod: string, data: any): Observable<any> {
    const url = `${this.apiEditar}/${asignaturaCod}`;
    return this.http.put<any>(url, data);
  }

  agregarAsignatura(data: any): Observable<any> {
    return this.http.post<any>(this.apiCrear, data);
  }

  eliminarAsignatura(asignaturaCod: string): Observable<any> {
    const url = `${this.apiEliminar}/${asignaturaCod}`;
    return this.http.delete<any>(url);
  }
}
