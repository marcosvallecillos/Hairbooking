import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalCompraComponent } from '../../components/modal-compra/modal-compra.component';
import { Router, RouterLink } from '@angular/router';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-carrito',
  imports: [FooterComponent, ModalCompraComponent, ProductsComponent,RouterLink],
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
      cantidad: 2
    },
    {
      id: 2,
      name: 'CLIPPER GOLD EDITION',
      price: 129.99,
      image: '../../../../images/clipper/clipper_wahl.jpg',
      cantidad: 1
    }
  ];

  ngOnInit() {
    this.productos = this.productos || [];
  }
  
  subtotal: number = 0;
  isSpanish: boolean = true;

  constructor(private languageService: LanguageService, private router: Router) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
    this.productos.forEach(product => {
      this.subtotal += product.price * product.cantidad;
      this.subtotal = parseFloat(this.subtotal.toFixed(2));
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

  
  actualizarCantidad(product: Product, input: HTMLInputElement) {
    // Convertimos el valor a número y manejamos casos inválidos
    const cantidad = parseInt(input.value) || 1; // Si falla la conversión, usa 1 como fallback
    if (isNaN(cantidad) || cantidad < 1) {
        product.cantidad = 1; // Valor mínimo por defecto
    } else {
        product.cantidad = cantidad;
    }
    this.calcularTotal();
}

calcularTotal() {
    this.subtotal = this.productos.reduce((acc, product) => {
        // Aseguramos que cada valor sea un número válido
        const precio = product.price || 0;
        const cantidad = product.cantidad || 0;
        return acc + (precio * cantidad);
    }, 0);
    this.subtotal = parseFloat(this.subtotal.toFixed(2));
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
      total: this.subtotal
    });
    this.router.navigate(['/showProfile']);
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
}
