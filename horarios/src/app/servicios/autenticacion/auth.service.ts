import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenSubject: BehaviorSubject<string | null>;
  private currentUserSubject: BehaviorSubject<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('access_token'));
    this.currentUserSubject = new BehaviorSubject<string | null>(localStorage.getItem('current_user'));
  }

  login(username: string, password: string): Observable<any> {
    console.log('Iniciando el proceso de login...');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    const body = JSON.stringify({ username, password });
    console.log('Enviando solicitud de autenticación con:', body);
    
    return this.http.post<any>('http://127.0.0.1:8000/api/v1/token/', body, { headers }).pipe(
      tap(response => {
        this.handleLoginResponse(response, username);
      }),
      switchMap(() => this.obtenerInfoUsuario())
    );
  }

  obtenerInfoUsuario(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any>('http://127.0.0.1:8000/api/v1/obtener_info_usuario/', { headers }).pipe(
      tap(user => {
        localStorage.setItem('current_user', user.username);
        localStorage.setItem('user_rol', user.rol.toString());
        this.currentUserSubject.next(user.username);
      }),
      catchError(this.handleLoginError)
    );
  }

  handleLoginResponse(response: any, username: string): void {
    console.log('Respuesta de autenticación recibida:', response);
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('current_user', username);
    this.tokenSubject.next(response.access);
    this.currentUserSubject.next(username);
  }

  handleLoginError(error: any): Observable<never> {
    console.error('Error en el proceso de login:', error);
    alert('Login fallido. Por favor, verifica tus credenciales.');
    return throwError(error);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('current_user');
  }

  getUserRol(): string | null {
    return localStorage.getItem('user_rol');
  }

  isAdmin(): boolean {
    return this.getUserRol() === '1';
  }

  logout(): void {
    console.log('Cerrando sesión...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('user_rol');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

