import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Valoracion } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api-service.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-valued-services',
  imports: [FooterComponent],
  templateUrl: './valued-services.component.html',
  styleUrl: './valued-services.component.css'
})
export class ValuedServicesComponent implements OnInit {

  valoraciones:Valoracion[] = [];
  isLoading: boolean = false;
  isSpanish: boolean = true; // Cambia esto según el idioma actual
  constructor(private languageService: LanguageService, private apiService: ApiService,private cdr: ChangeDetectorRef) {
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
        this.valoraciones = response.valoraciones; // Accede a la propiedad 'valoraciones'
        this.isLoading = false;
        console.log('Valoraciones:', this.valoraciones);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al obtener valoraciones:', error);
      }
    });
  }

  getStars(rating: number | null | undefined): string {
    if (rating === null || rating === undefined) {
      return '☆☆☆☆☆';
    }
    const fullStar = '★';
    const emptyStar = '☆';
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
  }
}
