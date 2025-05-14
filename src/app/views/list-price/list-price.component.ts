import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageService } from '../../services/language.service';
import { RouterLink } from '@angular/router';
import {  Usuario, Valoracion } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-list-price',
  imports: [FooterComponent, RouterLink,NgClass],
  templateUrl: './list-price.component.html',
  styleUrl: './list-price.component.css'
})
export class ListPriceComponent {
 isSpanish: boolean = true;
valoracion: Valoracion[] = [];
isLoading:boolean = false;
usuarios: Usuario[] = [];
  constructor(private languageService: LanguageService, private apiService:ApiService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
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
          })).sort((a, b) => {
            if (a.usuario_id && b.usuario_id) {
              return a.usuario_id - b.usuario_id;
            }
            return 0;
          });
        } else {
          this.valoracion =  [];
        }
        this.isLoading = false;
        console.log('Valoraciones cargadas:', this.valoracion);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al obtener valoraciones:', error);
      }
    });
  }
   valoracionPorGrupos(): any[][] {
    const grupos = [];
    for (let i = 0; i < this.valoracion.length; i += 3) {
      grupos.push(this.valoracion.slice(i, i + 3));
    }
    return grupos;
  }

   getStars(rating: number | null | undefined): string {
    if (rating === null || rating === undefined) {
      return '☆☆☆☆☆';
    }
    const fullStar = '★';
    const emptyStar = '☆';
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
  }
  getMediaStars(valoracion: Valoracion): number {
  const servicio = valoracion.servicioRating ?? 0;
  const peluquero = valoracion.peluqueroRating ?? 0;
  // Calcula la media aritmética y redondea a 1 decimal
  return Math.round(((servicio + peluquero) / 2) * 10) / 10;
}
getAverageStars(valoracion: Valoracion): string {
  const avg = this.getMediaStars(valoracion);
  return this.getStars(Math.round(avg));
}
}
