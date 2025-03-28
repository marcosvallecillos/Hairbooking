import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products = [
    {
      id: 1,
      name: 'Champú para Barba',
      description: 'Un champú especial para mantener tu barba limpia y suave.',
      price: "15.99 €",
      image: '../../../../images/champo_barba.png'
    },
    {
      id: 2,
      name: 'Cera para Cabello',
      description: 'Cera de alta calidad para un peinado perfecto.',
      price:" 12.99 €",
      image: '../../../../images/cera.png'
    },
    {
      id: 3,
      name: 'Aceite para Barba',
      description: 'Aceite nutritivo para una barba saludable.',
      price: "18.99€",
      image: '../../../../images/aceite.png'
    }
  ];

  addToCart(product: any) {
    console.log('Producto añadido al carrito:', product);
    
  }

  isSpanish: boolean = true;

  constructor(private languageService: LanguageService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
}
