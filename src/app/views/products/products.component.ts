import { Component, Input } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Product } from '../../models/user.interface';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products = {
    maquinas: {
      clippers: [
        {
          id: 1,
          name: 'CLIPPER SPACE X VERSACE ',
          price: "109,99 €",
          image: '../../../../images/clipper/clipper_space.jpg'
        },
        {
          id: 2,
          name: 'CLIPPER WAHL VAPOR 5 STAR CORDLESS ',
          price: " 159,99 €",
          image: '../../../../images/clipper/clipper_wahl.jpg'
        },
        {
          id: 3,
          name: 'Aceite para Barba',
          price: "18.99€",
          image: '../../../../images/aceite.png'
        }
      ],
      trimmer: [
        {    id: 1,
            name: 'Trimmer Skeleton ',
            price: "129,99 €",
            image: '../../../../images/clipper/clipper_space.jpg'
      },
      
    ]
    }
  };

  addToCart(product: any) {
    console.log('Producto añadido al carrito:', product);

  }
  currentFilter: string = '';

  getFilteredProducts() {
    if (!this.currentFilter) {
      return this.products.maquinas; 
    }
    return this.products.maquinas.clippers.filter(product =>
      product.name.toLowerCase().includes(this.currentFilter.toLowerCase())
    );
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
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
