import { Component } from '@angular/core';
import { Product } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';

import { FooterComponent } from '../../components/footer/footer.component';
import { ModalCompraComponent } from '../../components/modal-compra/modal-compra.component';
import { Router, RouterLink } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { ApiService } from '../../services/api-service.service';

@Component({
  selector: 'app-carrito',
  imports: [
    FooterComponent,
    ModalCompraComponent,
    ProductsComponent,
    RouterLink,
    ModalLoginComponent,
  ],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  productos: Product[] = [];
  isUser = true;
  subtotal: number = 0;
  total: number = 0;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;

  totalConDescuento: number = 0;
  descuento: number = 0;
  faltaParaDescuento: number = 0;

  constructor(
    private languageService: LanguageService,
    private apiService: ApiService, 
    private router: Router
  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => (this.isSpanish = isSpanish)
    );
    this.productos = this.apiService.getProductos(); 
    this.calcularTotalYDescuento();
  }

  ngOnInit() {
    this.calcularTotalYDescuento();
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

  addToFavorites(product: Product): void {
    console.log(`${product.name} añadido a favoritos`);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  eliminarproduct(product: Product): void {
    if (!this.isUser) {
      this.messageNoUserDisplay = this.getText(
        'Inicia sesión para eliminar productos de favoritos.',
        'Log in to remove products from favorites.'
      );
      setTimeout(() => {
        this.messageNoUserDisplay = null;
      }, 2000);
      return;
    }
    this.apiService.removeProduct(product.id); 
    this.productos = this.apiService.getProductos();
    product.insidecart = false; 
    this.messageNoCart = `${product.name} ` + this.getText('ha sido eliminado del carrito.', 'has been removed from cart.');
    setTimeout(() => {
      this.messageNoCart = null;
    }, 2000);
    this.calcularTotalYDescuento();
  }
  messageNoUserDisplay: string | null = null;
  messageNoCart: string | null = null;
  
  actualizarCantidad(product: Product, input: EventTarget | null): void {
    const inputElement = input as HTMLInputElement;
    const nuevaCantidad = parseInt(inputElement.value);

    if (!isNaN(nuevaCantidad) && nuevaCantidad >= 1) {
      product.cantidad = Math.min(nuevaCantidad, 5);
      inputElement.value = product.cantidad.toString();
      this.apiService.updateQuantity(product.id, product.cantidad); 
    }
    this.calcularTotalYDescuento();
  }

  validarCantidad(product: Product, input: EventTarget | null): void {
    const inputElement = input as HTMLInputElement;
    const nuevaCantidad = parseInt(inputElement.value);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      product.cantidad = 1;
      inputElement.value = '1';
    } else {
      product.cantidad = Math.min(nuevaCantidad, 5);
      inputElement.value = product.cantidad.toString();
    }
    this.apiService.updateQuantity(product.id, product.cantidad); 
    this.calcularTotalYDescuento();
  }

  showModal: boolean = false;
  selectedName: string = '';
  selectedPrice: string = '';
  selectedCantidad: string = '';

  onConfirmReserve() {
    this.showModal = false;
    // Enviar productos al historial de compras
    this.apiService.addToPurchases([...this.productos]);
    this.apiService.clearCart();
    this.productos = this.apiService.getProductos();  
    console.log('Datos de la reserva:', {
      nombre: this.productos.map((producto) => producto.name),
      precio: this.productos.map((producto) => producto.price),
      cantidad: this.productos.map((producto) => producto.cantidad),
      total: this.total,
    });
    this.router.navigate(['/show-buys']); 
  }

  onReserve() {
    this.showModal = true;
  }

  onCancelReserve() {
    this.showModal = false;
    window.location.reload();
  }

  nombresProductos(): string {
    return this.productos.map((producto) => producto.name).join(', ');
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
}