import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/user.interface';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  registerUser(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }
  loginUser(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password });
  }
} 