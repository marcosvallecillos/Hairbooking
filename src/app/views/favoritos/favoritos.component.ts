import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favoritos',
  imports: [FooterComponent, RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {
  productos: Product[] = [];
  cart: Product[] = [];
  message: string | null = null;
  messageTrue: string | null = null;
  messageNoFavorite: string | null = null;
  messageNoUserDisplay: string | null = null;
  isSpanish: boolean = true;
  isUser = false;
  isLoading: boolean = true;

  constructor(
    private languageService: LanguageService,
    private apiservice: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => (this.isSpanish = isSpanish)
    );
  }

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.isUser = true;
      this.loadFavorites(userId);
    } else {
      this.isUser = false;
      this.isLoading = false;
      
    }
  }

  loadFavorites(userId: number) {
    this.apiservice.getFavoritesByUsuarioId(userId).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.favoritos) {
          this.productos = response.favoritos.map((producto: any) => ({
            id: producto.id,
            name: producto.name,
            price: producto.price,
            image: producto.image,
            cantidad: producto.cantidad || 1,
            isFavorite: producto.favorite,
            insidecart: producto.cart,
            categorias: producto.categoria,
            subcategorias: producto.subcategoria
          }));
        } else {
          this.productos = [];
          this.messageNoUserDisplay = this.getText(
            'No hay productos favoritos',
            'No favorite products'
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar favoritos:', error);
        this.messageNoUserDisplay = this.getText(
          'Error al cargar los favoritos',
          'Error loading favorites'
        );
        this.isLoading = false;
      }
    });
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  addToCart(product: Product) {
    if (!this.isUser) {
      this.messageNoUserDisplay = this.getText(
        'Debes iniciar sesión para añadir al carrito',
        'You must log in to add to cart'
      );
      return;
    }

    const productInCart = this.cart.find(item => item.id === product.id);
    if (productInCart) {
      this.messageTrue = `${product.name} ` + this.getText('ya está en el carrito.', 'is already in the cart.');
    } else {
      product.insidecart = true;
      this.cart.push(product);
      this.apiservice.addProduct({ ...product });
      this.apiservice.updateProductFavorite(product.id, false).subscribe({
        next: () => {
          this.productos = this.productos.filter(p => p.id !== product.id);
          this.message = `${product.name} ` + this.getText('ha sido añadido al carrito.', 'has been added to the cart.');
        },
        error: (error) => {
          console.error('Error al actualizar favorito:', error);
          this.messageNoUserDisplay = this.getText(
            'Error al actualizar el producto',
            'Error updating product'
          );
        }
      });
    }

    setTimeout(() => {
      this.message = null;
      this.messageTrue = null;
      this.messageNoUserDisplay = null;
    }, 2000);
  }

  eliminarproduct(product: Product) {
    if (!this.isUser) {
      this.messageNoUserDisplay = this.getText(
        'Debes iniciar sesión para eliminar favoritos',
        'You must log in to remove favorites'
      );
      return;
    }

    this.apiservice.updateProductFavorite(product.id, false).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id !== product.id);
        this.messageNoFavorite = `${product.name} ` + this.getText('ha sido eliminado de favoritos.', 'has been removed from favorites.');
      },
      error: (error) => {
        console.error('Error al eliminar favorito:', error);
        this.messageNoUserDisplay = this.getText(
          'Error al eliminar el favorito',
          'Error removing favorite'
        );
      }
    });

    setTimeout(() => {
      this.messageNoFavorite = null;
      this.messageNoUserDisplay = null;
    }, 2000);
  }
}
