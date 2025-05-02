import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  productos: Product[] = []; // Solo para favoritos
  cartItems: Product[] = []; // Para el carrito
  message: string | null = null;
  messageTrue: string | null = null;
  messageNoFavorite: string | null = null;
  messageNoUserDisplay: string | null = null;
  isSpanish: boolean = true;
  isUser = false;
  isLoading: boolean = true;
  isProcessing:{ [productId: number]: boolean } = {};


  constructor(
    private languageService: LanguageService,
    private apiservice: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
      this.loadCart(userId); // Cargar el carrito inicialmente
      // Suscribirse a cambios en la cantidad de ítems del carrito
      this.apiservice.cartItemsCount$.subscribe(count => {
        console.log('Cantidad de ítems en el carrito actualizada:', count);
         this.apiservice.getCart(); 
      });
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
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar favoritos:', error);
        this.messageNoUserDisplay = this.getText(
          'Error al cargar los favoritos',
          'Error loading favorites'
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCart(userId: number) {
    this.apiservice.getCartByUsuarioId(userId).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.carrito) {
          this.cartItems = response.carrito.map((producto: any) => ({
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
          this.cartItems = [];
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
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
    this.apiservice.updateProductFavorite(product.id, true).subscribe({
      
      next: () => {
        this.isProcessing[product.id] = true;

        this.apiservice.updateProductCart(product.id, true).subscribe({
          next: (response: any) => {
            console.log('Respuesta del carrito:', response);
            if (response.message === 'Producto agregado al carrito correctamente') {
              this.productos = this.productos.filter(p => p.id !== product.id);
            
              // Volver a cargar favoritos y carrito para asegurar la actualización
              const userId = this.authService.getUserId();
              if (userId) {
                this.loadFavorites(userId);
                this.loadCart(userId);
              }
            
              this.message = `${product.name} ` + this.getText('ha sido añadido al carrito.', 'has been added to the cart.');
              setTimeout(() => {
                this.message = null;
                this.cdr.detectChanges();
              }, 2000);
              }
            else {
              console.error('Respuesta no exitosa:', response);
              this.message = this.getText(
                'Error al añadir el producto al carrito',
                'Error adding product to cart'
              );
              this.isProcessing[product.id] = false;
            }
          },
          error: (error) => {
            console.error('Error en updateProductCart:', error);
            this.message = this.getText(
              'Error al añadir al carrito',
              'Error adding to cart'
            );
            this.isProcessing[product.id] = false;

          }
        });
      },
      error: (error) => {
        console.error('Error en updateProductFavorite:', error);
        this.messageNoUserDisplay = this.getText(
          'Error al actualizar el producto',
          'Error updating product'
        );
        this.isProcessing[product.id] = false;

      }
    });
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
        this.cdr.detectChanges();
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
      this.cdr.detectChanges();
    }, 2000);
  }
}