import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { Product } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { ModalCompraComponent } from '../modal-compra/modal-compra.component';
import { FooterComponent } from '../footer/footer.component';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { UserStateService } from '../../services/user-state.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ModalCompraComponent, FooterComponent, ModalLoginComponent],
  templateUrl: './modal-carrito.component.html',
  styleUrls: ['./modal-carrito.component.css']
})
export class ModalCarritoComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  total: number = 0;
  isProcessing:{ [productId: number]: boolean } = {};

  productos: Product[] = [];
  productosFavoritos: Product[] = [];
  isUser = false;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;
  isLoading: boolean = true;

  totalConDescuento: number = 0;
  descuento: number = 0;
  faltaParaDescuento: number = 0;

  message: string | null = null;
  messageNoUserDisplay: string | null = null;

  constructor(
    private languageService: LanguageService,
    private apiService: ApiService,
    private router: Router,
    private userStateService: UserStateService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef

  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => {
        this.isSpanish = isSpanish;
      }
    );
  }
  private cartSubscription: Subscription | undefined; // Para manejar la suscripción a cartItemsCount$

 ngOnInit() {
  this.isUser = this.userStateService.getIsUser();

  this.userStateService.isUser$.subscribe(isUser => {
    this.isUser = isUser;

    // Si el usuario está logueado
    if (isUser) {
      this.cargarCarrito();
      this.cargarFavoritos();

      this.cartSubscription = this.apiService.cartItemsCount$.subscribe(count => {
                if (count >= 0) {
                    this.cargarCarrito();
                } else {
                    this.productos = [];
                    this.calcularTotalYDescuento();
                    this.cdr.detectChanges();
                }
            });

    } else {
      this.productos = [];
      this.productosFavoritos = [];
      this.calcularTotalYDescuento();

      if (this.cartSubscription) {
        this.cartSubscription.unsubscribe();
        this.cartSubscription = undefined;
      }
    }
  });
}



  cargarCarrito() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.isLoading = true;
      this.apiService.getCartByUsuarioId(userId).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.carrito) {
            // Mantener las cantidades existentes si el producto ya está en el carrito
            const nuevosProductos = response.carrito.map((producto: any) => {
              const productoExistente = this.productos.find(p => p.id === producto.id);
              return {
                id: producto.id,
                name: producto.name,
                price: producto.price,
                image: producto.image,
                cantidad: productoExistente ? productoExistente.cantidad : (producto.cantidad || 1),
                isFavorite: producto.favorite,
                insidecart: producto.cart,
                categorias: producto.categoria,
                subcategorias: producto.subcategoria
              };
            });
            this.productos = nuevosProductos;
            this.calcularTotalYDescuento();
            this.cdr.detectChanges();
          } else {
            this.productos = [];
            this.calcularTotalYDescuento();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar el carrito:', error);
          this.message = this.getText(
            'Error al cargar el carrito',
            'Error loading cart'
          );
          this.productos = [];
          this.calcularTotalYDescuento();
          this.isLoading = false;
        }
      });
    }
  }

  cargarFavoritos() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.apiService.getFavoritesByUsuarioId(userId).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.favoritos) {
            this.productosFavoritos = response.favoritos.map((producto: any) => ({
              id: producto.id,
              name: producto.name,
              price: producto.price,
              image: producto.image,
              cantidad: producto.cantidad || 1,
              isFavorite: true,
              insidecart: producto.cart,
              categorias: producto.categoria,
              subcategorias: producto.subcategoria
            }));
            this.cdr.detectChanges();
          } else {
            this.productosFavoritos = [];
          }
        },
        error: (error) => {
          console.error('Error al cargar favoritos:', error);
          this.productosFavoritos = [];
        }
      });
    }
  }

  calcularTotalYDescuento() {
    this.total = this.productos.reduce(
      (sum, product) => sum + product.price * product.cantidad,
      0
    );

    if (this.total < 500) {
      this.faltaParaDescuento = 500 - this.total;
    } else {
      this.faltaParaDescuento = 0;
    }

    if (this.total > 500) {
      this.descuento = this.total * 0.05;
      this.totalConDescuento = this.total - this.descuento;
    } else {
      this.descuento = 0;
      this.totalConDescuento = this.total;
    }
  }

  showZeroTotalAlert() {
    this.message = this.getText(
      'Se ha producido un problema, disculpa las molestias. Contactanos si el problema persiste.',
      'There was a problem, sorry for the inconvenience. Contact us if the problem persists.'
    );
 
    setTimeout(() => {
      this.message = null;
    }, 4000);
  }

  addToFavorites(product: Product) {
    if (!this.isUser) {
      this.messageNoUserDisplay = this.getText(
        'Debes iniciar sesión para añadir a favoritos',
        'You must log in to add to favorites'
      );
      
      return;


    }

    this.apiService.updateProductFavorite(product.id, true).subscribe({
      next: () => {
        this.message = `${product.name} ` + this.getText('ha sido añadido a favoritos.', 'has been added to favorites.');
      },
      error: (error) => {
        console.error('Error al añadir a favoritos:', error);
        this.message = this.getText(
          'Error al añadir a favoritos',
          'Error adding to favorites'
        );
      }
    });

    setTimeout(() => {
      this.message = null;
      this.messageNoUserDisplay = null;
    }, 2000);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  eliminarproduct(product: Product) {
    this.isProcessing[product.id] = true; // Marcar el producto como en proceso de eliminación
    if (!this.isUser) {
      this.messageNoUserDisplay = this.getText(
        'Debes iniciar sesión para eliminar productos',
        'You must log in to remove products'
      );
      return;
    }

    this.apiService.eliminarDelCarrito(product.id).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.productos = this.productos.filter(p => p.id !== product.id);
          this.calcularTotalYDescuento();
          this.apiService.updateCartItemsCount();
          this.message = `${product.name} ` + this.getText('ha sido eliminado del carrito.', 'has been removed from cart.');
        } else {
          this.message = this.getText(
            'Error al eliminar el producto',
            'Error removing product'
          );
          this.isProcessing[product.id] = false;

        }
      },
      error: (error) => {
        console.error('Error al eliminar del carrito:', error);
        this.message = this.getText(
          'Error al eliminar del carrito',
          'Error removing from cart'
        );
      }
    });

    setTimeout(() => {
      this.message = null;
      this.messageNoUserDisplay = null;
    }, 2000);
  }

  actualizarCantidad(product: Product, input: EventTarget | null): void {
    if (!input || !(input instanceof HTMLInputElement)) return;
    
    const nuevaCantidad = parseInt(input.value);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      input.value = '1';
      product.cantidad = 1;
    } else {
      product.cantidad = nuevaCantidad;
    }

    // Actualizar la cantidad en el backend
    const userId = this.authService.getUserId();
    if (userId) {
      console.log('Enviando actualización de cantidad:', {
        productoId: product.id,
        usuario_id: userId,
        cantidad: product.cantidad
      });

      this.apiService.actualizarCantidad(product.id, {
        usuario_id: userId,
        cantidad: product.cantidad
      }).subscribe({
        next: (response) => {
          console.log('Cantidad actualizada:', response);
          this.calcularTotalYDescuento();
        },
        error: (error) => {
          console.error('Error al actualizar cantidad:', error);
          // Revertir la cantidad en caso de error
          input.value = product.cantidad.toString();
          this.message = this.getText(
            'Error al actualizar la cantidad',
            'Error updating quantity'
          );
        }
      });
    }
  }

  validarCantidad(product: Product, input: EventTarget | null): void {
    if (!input || !(input instanceof HTMLInputElement)) return;
    
    const cantidad = parseInt(input.value);
    if (isNaN(cantidad) || cantidad < 1) {
      input.value = '1';
      product.cantidad = 1;
      this.actualizarCantidad(product, input);
    }
  }

  showModal: boolean = false;

  onConfirmReserve() {
       this.showModal = false;
  this.show = false;    
    if (this.totalConDescuento === 0) {
      this.showZeroTotalAlert();
      return;
    }
    
    const userId = this.authService.getUserId();
    if (!userId) return;

    // Verificar que hay productos en el carrito
    if (!this.productos || this.productos.length === 0) {
      console.error('No hay productos en el carrito');
      return;
    }

    // LOG: Mostrar el estado del carrito antes de comprar
    console.log('Carrito antes de comprar:', JSON.stringify(this.productos, null, 2));

    const purchase = {
      productos: this.productos.map(product => ({
        productoId: product.id,
        cantidad: product.cantidad
      })),
      descuento: this.descuento
    };

    // LOG: Mostrar el objeto de compra que se enviará
    console.log('Objeto de compra enviado al backend:', JSON.stringify(purchase, null, 2));

    this.apiService.makePurchase(purchase, userId).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response); // Para debug
        if (response.mensaje === 'Compra registrada') {
          this.productos = [];
          this.calcularTotalYDescuento();
          this.showModal = false;
          this.router.navigate(['/show-buys']);
        }
      },
      error: (error) => {
        console.error('Error al realizar la compra:', error);
      }
    });
  }

  onPay() {
    if (this.totalConDescuento === 0) {
      this.showZeroTotalAlert();
      return;
    }
    this.showModal = true;
  }

  onCancelReserve() {
    this.showModal = false;
  }

  nombresProductos(): string {
    return this.productos.map((producto) => producto.name).join(', ');
  }

  cantidadProductos(): string {
    return this.productos
      .map((producto) => producto.cantidad)
      .join(' , ') + ' unidades';
  }
  precioProductos(): string {
    return (
      this.productos
        .map((producto) => producto.price * producto.cantidad)
        .join('€ , ') + '€'
    );
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  onClose() {
    this.close.emit();
  }

 
}