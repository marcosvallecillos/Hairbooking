import { Component, Input } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Product } from '../../models/user.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
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
          image: '../../../../images/clipper/clipper_space.jpg',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 2,
          name: 'CLIPPER WAHL VAPOR 5 STAR CORDLESS ',
          price: " 159,99 €",
          image: '../../../../images/clipper/clipper_wahl.jpg',
          isFavorite: false,
        },
        {
          id: 3,
          name: 'Trimmer Skeleton ',
          price: "129,99 €",
          image: '../../../../images/trimmer/trimmer_skeleton.jpg',
          isFavorite: false,
        },
        {
          id: 4,
          name: 'Shaver Wad ',
          price: "59,99 €",
          image: '../../../../images/shaver/shaver.jpg',
          isFavorite: false,
        },
      ]
    },
    cosmeticos: [
      {
        id: 1,
        name: 'Difusor de Agua',
        price: '9,99€',
        image: '../../../../images/cosmeticos/difusor.png',
        isFavorite: false,
        insidecart: false,
      },
      {
        id: 2,
        name: 'Cera de Pelo',
        price: '2,99€',
        image: '../../../../images/cosmeticos/cera.png',
        isFavorite: false,
      },
      {
        id: 3,
        name: 'Champú para barba',
        price: '2,99€',
        image: '../../../../images/cosmeticos/champu_barba.png',
        isFavorite: false,
      },
      {
        id: 4,
        name: 'Aceite para Barba',
        price: "18.99€",
        image: '../../../../images/aceite.png',
        isFavorite: false,
      }
    ],
  };

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

  favorite(product: any): void {
    product.isFavorite = !product.isFavorite;
    if (product.isFavorite) {
      console.log('Producto añadido a favoritos:', product);
    } else {
      console.log('Producto eliminado de favoritos:', product);
    }
  }
  cart: Product[] = [];

  productInCart(product: any) {
    product.insidecart = !product.insidecart;
    const productInCart = this.cart.find(item => item.id === product.id);
    if (productInCart) {
      alert(`${product.name} ya está en el carrito.`);
    } else {
      this.cart.push(product);
      console.log('Producto añadido al carrito:', product);
      alert(`${product.name} ha sido añadido al carrito.`);
    }
  }
}
