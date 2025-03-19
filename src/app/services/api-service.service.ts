import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Usuario {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  registerUser(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }
} 