import { Component } from '@angular/core';
import { Usuario, Valoracion } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api-service.service';

@Component({
  selector: 'app-rating-service',
  imports: [],
  templateUrl: './rating-service.component.html',
  styleUrl: './rating-service.component.css'
})
export class RatingServiceComponent {
    isSpanish = true;
    valoracion: Valoracion[] = [];
    valoracionGrupos: Valoracion[][] = []; // <-- NUEVO
    isLoading = false;
    usuarios: Usuario[] = [];
  
    constructor(private languageService: LanguageService, private apiService: ApiService) {
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
    }
 ngOnInit(): void {
    this.getAllValoraciones();
  }

  getAllValoraciones() {
    this.isLoading = true;
    this.apiService.getValoraciones().subscribe({
      next: (response) => {
        if (response && response.valoraciones) {
          this.valoracion = response.valoraciones.map(valoracion => ({
            ...valoracion,
            usuario_id: valoracion.usuario?.id || valoracion.usuario_id,
            reserva_id: valoracion.reserva?.id || valoracion.reserva_id
          }));
     
        } else {
          this.valoracion = [];
        }
        this.calculaGrupos(); // <-- ACTUALIZA LOS GRUPOS
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.valoracion = [];
        this.calculaGrupos();
        console.error('Error al obtener valoraciones:', error);
      }
    });
  }

  calculaGrupos() {
    this.valoracionGrupos = [];
    for (let i = 0; i < this.valoracion.length; i += 3) {
      this.valoracionGrupos.push(this.valoracion.slice(i, i + 3));
    }
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  
getStars(rating: number | null | undefined): string[] {
  if (rating === null || rating === undefined) {
    return Array(5).fill('empty');
  }
  const icons = [];
  const fullestrella = Math.floor(rating);
  const mitad = rating % 1 >= 0.5;
  for (let i = 0; i < fullestrella; i++) {
    icons.push('full');
  }
  if (mitad) {
    icons.push('half');
  }
  while (icons.length < 5) {
    icons.push('empty');
  }
  return icons;
}


  getMediaStars(valoracion: Valoracion): number {
    const servicio = valoracion.servicioRating ?? 0;
    const peluquero = valoracion.peluqueroRating ?? 0;
    return Math.round(((servicio + peluquero) / 2) * 10) / 10;
  }

getAverageStars(valoracion: Valoracion): string[] {
  const avg = this.getMediaStars(valoracion);
  return this.getStars(avg);
}
}
