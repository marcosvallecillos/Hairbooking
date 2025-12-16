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
  hasItemsInCart: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  isLoading: boolean = false;
  showAlert: boolean = false;
  showAlertCancel: boolean = false;
  messageNoUserDisplay: string | null = null;
  isSpanish: boolean = true;
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
      this.checkCartStatus();
    }

  }

  checkCartStatus() {
    this.isLoading = true;
    if (!this.userId) return;

    this.apiService.getCartByUsuarioId(this.userId).subscribe({
      next: (response: any) => {
        this.hasItemsInCart = response.status === 'success' && 
                             response.carrito && 
                             response.carrito.length > 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al verificar el carrito:', error);
        this.hasItemsInCart = false;
        this.isLoading = false;
      }
    });
  }

  onConfirm() {
    if (!this.userId) {
      this.messageNoUserDisplay = this.getText(
        'Debes iniciar sesión para realizar la compra',
        'You must log in to make a purchase'
      );
      return;
    }

    if (!this.hasItemsInCart) {
      this.messageNoUserDisplay = this.getText(
        'El carrito está vacío',
        'Cart is empty'
      );
      return;
    }

    this.isProcessing = true;
    this.messageNoUserDisplay = this.getText(
      'Comprando...',
      'Purchasing...'
    );

    this.apiService.getCartByUsuarioId(this.userId).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.carrito) {
          const purchase = {
            productos: response.carrito.map((producto: any) => ({
              productoId: producto.id,
              cantidad: producto.cantidad || 1
            }))
          };

          this.apiService.makePurchase(purchase, this.userId!).subscribe({
            next: (purchaseResponse: any) => {
              if (purchaseResponse.mensaje === 'Compra registrada') {
                this.show = false;
                this.showAlert = true;
                this.apiService.clearCart();
                this.hasItemsInCart = false;
                
                setTimeout(() => {
                  this.showAlert = false;
                  this.confirm.emit();
                  this.isProcessing = false;
                }, 1000);
                this.router.navigate(['/show-buys']);
              } else {
                this.messageNoUserDisplay = this.getText(
                  'Error al realizar la compra',
                  'Error making purchase'
                );
                this.isProcessing = false;
              }
            },
            error: (error) => {
              console.error('Error en la compra:', error);
              this.messageNoUserDisplay = this.getText(
                'Error al realizar la compra: ' + (error.error?.message || error.message),
                'Error making purchase: ' + (error.error?.message || error.message)
              );
              this.isProcessing = false;
            }
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener el carrito:', error);
        this.messageNoUserDisplay = this.getText(
          'Error al verificar el carrito',
          'Error checking cart'
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
