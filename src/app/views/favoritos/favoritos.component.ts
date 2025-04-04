import { Component } from '@angular/core';
import {  Productos } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-favoritos',
  imports: [FooterComponent,RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent {
  productos: Productos[] = [];
  cart: Productos[] = [];
  message: string | null = null;
  messageTrue: string | null = null;
  messageNoFavorite: string | null = null;
  messageNoUserDisplay: string | null = null;
  isSpanish: boolean = true;
  isUser = false;
  constructor(
    private languageService: LanguageService,
    private apiservice: ApiService,
    private router: Router
  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => (this.isSpanish = isSpanish)
    );
    this.productos = this.apiservice.getFavorites();
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  addToCart(product: Productos) {

    const productInCart = this.cart.find(item => item.id === product.id);
    if (productInCart) {
      this.messageTrue = `${product.name} ` + this.getText('ya está en el carrito.', 'is already in the cart.');
    } else {
      product.insidecart = true;
      this.cart.push(product);
      this.apiservice.addProduct({ ...product });
      this.message = `${product.name} ` + this.getText('ha sido añadido al carrito.', 'has been added to the cart.');
    }

    setTimeout(() => {
      this.message = null;
      this.messageTrue = null;
    }, 2000);
  }

  eliminarproduct(product: Productos) {
   
    

    this.apiservice.removeFavorite(product.id);
    this.productos = this.apiservice.getFavorites();
    product.isFavorite = false; 
    this.messageNoFavorite = `${product.name} ` + this.getText('ha sido eliminado de favoritos.', 'has been removed from favorites.');

    setTimeout(() => {
      this.messageNoFavorite = null;
    }, 2000);
  }
}
