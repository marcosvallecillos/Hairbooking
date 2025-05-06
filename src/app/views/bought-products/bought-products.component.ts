import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageService } from '../../services/language.service';
import { Compra } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-bought-products',
  imports: [CommonModule, FooterComponent],
  templateUrl: './bought-products.component.html',
  styleUrl: './bought-products.component.css'
})
export class BoughtProductsComponent {
isLoading: boolean = false;
compras: Compra[] = [];
  isSpanish: boolean = true; // Cambia esto según el idioma actual

  constructor(private languageService: LanguageService, private apiService: ApiService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );

  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  ngOnInit(): void {
    this.getAllCompras();
  }
  getAllCompras() {
    this.isLoading = true;
    this.apiService.getCompras().subscribe({
      next: (response) => {
        this.compras = response; 
        this.isLoading = false;
        console.log('Compras:', response);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al obtener compras:', error);
      }
    });
}

calcularDescuento(total: number): number {
  if (total > 500) {
    return total * 0.05;
  }
  return 0;
}
}
