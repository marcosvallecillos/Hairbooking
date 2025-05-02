import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api-service.service';
import { Compra, Product } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-compra',
  imports: [],
  templateUrl: './modal-compra.component.html',
  styleUrl: './modal-compra.component.css'
})
export class ModalCompraComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() producto: string | null = '';
  @Input() precio: number | string = ' ';
  @Input() descuento: string = '';
  @Input() cantidad: string = '';
  @Input() total: string = '';
  isProcessing: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  
  showAlert: boolean = false;
  showAlertCancel: boolean = false;
  messageNoUserDisplay: string | null = null;
  isSpanish: boolean = true;
  cartItems: Product[] = [];
  userId: number | null = null;

  constructor(
    private languageService: LanguageService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.loadCart(this.userId);
    }
      console.log('Id del usuario:', this.userId);
  }


  ngOnChanges() {
    this.precio = parseFloat(this.precio as string).toFixed(2);
  }

  loadCart(userId: number) {
    this.apiService.getCartByUsuarioId(userId).subscribe({
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
        }
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
        this.messageNoUserDisplay = this.getText(
          'Error al cargar el carrito',
          'Error loading cart'
        );
      }
    });
  }

  onConfirm() {
    console.log('Iniciando proceso de compra...');
    console.log('Cart items:', this.cartItems);
    this.messageNoUserDisplay = this.getText(
      'Comprando...',
      'Purchasing...'
    );
    console.log(this.messageNoUserDisplay);
    this.isProcessing = true;
    if (!this.userId) {
      console.error('No hay userId');
      this.messageNoUserDisplay = this.getText(
        'Debes iniciar sesión para realizar la compra',
        'You must log in to make a purchase'
      );
      return;
    }

    if (!this.cartItems || this.cartItems.length === 0) {
      console.error('No hay items en el carrito');
      this.messageNoUserDisplay = this.getText(
        'El carrito está vacío',
        'Cart is empty'
        
      );
      this.isProcessing = false;

      return;
    }

    const purchase = {
      productos: this.cartItems.map(product => ({
        productoId: product.id,
        cantidad: product.cantidad || 1
      }))
    };

    console.log('Enviando compra:', purchase);

    this.apiService.makePurchase(purchase, this.userId).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);
        if (response.mensaje === 'Compra registrada') {
          this.show = false;
          this.showAlert = true;
          this.apiService.clearCart();
          this.cartItems = [];
          
          setTimeout(() => {
            this.showAlert = false;
            this.confirm.emit();
            this.isProcessing = false;

          }, 1000);
          this.router.navigate(['/show-buys']);
        } else {
          console.error('Error en la respuesta:', response);
          this.messageNoUserDisplay = this.getText(
            'Error al realizar la compra',
            'Error making purchase'
          );
          this.isProcessing = false;

        }
      },
      error: (error) => {
        console.error('Error completo:', error);
        this.messageNoUserDisplay = this.getText(
          'Error al realizar la compra: ' + (error.error?.message || error.message),
          'Error making purchase: ' + (error.error?.message || error.message)
        );
        this.isProcessing = false;

      }
    });
  }

  onCancel() {
    this.show = false;
    this.showAlertCancel = true;
    setTimeout(() => {
      this.showAlertCancel = false;
      this.cancel.emit();
    }, 1000);
  }

  onClose() {
    this.close.emit();
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
}
