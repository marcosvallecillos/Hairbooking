import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalCompraComponent } from '../../components/modal-compra/modal-compra.component';
import { Router, RouterLink } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';

@Component({
  selector: 'app-carrito',
  imports: [FooterComponent, ModalCompraComponent, ProductsComponent,RouterLink,ModalLoginComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  productos: Product[]  = [
    {
      id: 1,
      name: 'CLIPPER SPACE X VERSACE',
      price: 109.99,
      image: '../../../../images/clipper/clipper_space.jpg',
      cantidad: 2,
      isFavorite: false,
    },
    {
      id: 2,
      name: 'CLIPPER GOLD EDITION',
      price: 129.99,
      image: '../../../../images/clipper/clipper_wahl.jpg',
      cantidad: 1,
      isFavorite: false,

    }
  ];

  isUser = false;
  subtotal: number = 0;
  total: number = 0;
  isSpanish: boolean = true;
  showLoginModal:boolean= false;

  constructor(private languageService: LanguageService, private router: Router) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
    this.productos.forEach(product => {
      this.total += product.price * product.cantidad;
      
    });
    this.calcularTotal();

  }
  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  eliminarproduct(product: Product) {
    this.productos = this.productos.filter(p => p.id !== product.id);
    this.calcularTotal();
  }

actualizarCantidad(product: Product, input: EventTarget | null): void {
  const inputElement = input as HTMLInputElement;
  const nuevaCantidad = parseInt(inputElement.value);

  if (!isNaN(nuevaCantidad) && nuevaCantidad >= 1) {
    product.cantidad = Math.min(nuevaCantidad, 5);
    inputElement.value = product.cantidad.toString();
  }
  this.calcularTotal();
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
  
  this.calcularTotal();
}

calcularTotal() {
    this.total = this.productos.reduce((acc, product) => {
        const precio = product.price || 0;
        const cantidad = product.cantidad || 0;
        return acc + (precio * cantidad);
    }, 0);
   
}
  showModal: boolean = false;
  selectedName: string = '';
  selectedPrice: string = '';
  selectedCantidad: string = '';

  onConfirmReserve() {
    this.showModal = false;

    console.log('Datos de la reserva:', {
      nombre: this.productos.map(producto => producto.name),
      precio: this.productos.map(producto => producto.price),
      cantidad: this.productos.map(producto => producto.cantidad),
      total: this.total
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
    return this.productos.map(producto => producto.name).join(', ');
  }

  precioProductos(): string {
    return this.productos
      .map(producto => producto.price * producto.cantidad)
      .join('€ , ') + '€';
    
  }
  openLoginModal() {
    this.showLoginModal = true;
  }
}
