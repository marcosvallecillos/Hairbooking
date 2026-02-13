import { Component, Inject, AfterViewInit, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { ApiService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('cardNumberElement') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiryElement') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvcElement') cardCvcElement!: ElementRef;

  @Input() show: boolean = false;
  @Input() cartItems: any[] = [];
  @Input() usuarioId: number | null = null;
  @Input() descuento: number = 0;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  stripe!: Stripe | null;
  elements!: StripeElements | null;
  cardNumber!: StripeCardNumberElement | null;
  cardExpiry!: StripeCardExpiryElement | null;
  cardCvc!: StripeCardCvcElement | null;

  // Formulario
  email: string = '';
  emailErrors: string = '';
  nombreCompleto: string = '';
  pais: string = '';
  direccion: string = '';
  ciudad: string = '';
  codigoPostal: string = '';

  paises: { name: string; code: string }[] = [
    { name: 'España', code: 'ES' },
    { name: 'Estados Unidos', code: 'US' },
    { name: 'México', code: 'MX' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Chile', code: 'CL' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Perú', code: 'PE' },
    { name: 'Venezuela', code: 'VE' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Uruguay', code: 'UY' }
  ];
  

  isProcessing = false;
  isLoading = true;
  isLoadingProducts = true;
  producto: string = '';
  hasItemsInCart = false;
  showAlert = false;
  showAlertCancel = false;
  messageNoUserDisplay: string | null = null;
  isSpanish: boolean = true;
  userId: number | null = null;
  cardBrand: 'visa' | 'mastercard' | 'discover'  | 'unknown' | null = null;

  cantidad: number = 0;
  precio: string = '';
  descuentoFormateado: string = '';
  total: string = '';

  constructor(
    @Optional() public dialogRef: MatDialogRef<CheckoutComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private authService: AuthService,
    private languageService: LanguageService,
    private router: Router
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit(): void {
    this.inicializarComponente();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cartItems'] || changes['descuento'] || changes['show']) {
      if (changes['show']?.currentValue === true) {
        this.cargarProductosDelCarrito();
      }
      
      this.inicializarComponente();
      
      if (changes['show']?.currentValue === true && !changes['show'].firstChange) {
        setTimeout(() => this.inicializarStripeYElementos(), 100);
      }
    }
  }

  private cargarProductosDelCarrito(): void {
    if (!this.userId) {
      this.isLoadingProducts = false;
      return;
    }

    this.isLoadingProducts = true;
    this.apiService.getCartByUsuarioId(this.userId).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.carrito) {
          this.cartItems = response.carrito.map((producto: any) => ({
            id: producto.id,
            name: producto.name,
            price: producto.price,
            cantidad: producto.cantidad || 1,
            image: producto.image
          }));

          if (this.data) {
            this.data.cartItems = this.cartItems;
          } else {
            this.data = {
              cartItems: this.cartItems,
              usuarioId: this.userId,
              descuento: this.descuento
            };
          }

          this.calcularResumen();
        }
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Error al cargar productos del carrito:', error);
        this.isLoadingProducts = false;
      }
    });
  }

  private inicializarComponente(): void {
    const cartItems = this.data?.cartItems || this.cartItems || [];
    const usuarioId = this.data?.usuarioId || this.usuarioId || this.authService.getUserId();
    const descuento = this.data?.descuento || this.descuento || 0;

    this.userId = usuarioId;
    
    if (!this.data) {
      this.data = {
        cartItems: cartItems,
        usuarioId: usuarioId,
        descuento: descuento
      };
    } else {
      this.data.cartItems = cartItems;
      this.data.usuarioId = usuarioId;
      this.data.descuento = descuento;
    }

    if (this.userId) {
      this.checkCartStatus();
    } else {
      this.isLoadingProducts = false;
    }
    
    // Si ya hay productos, calcular resumen inmediatamente
    if (cartItems.length > 0) {
      this.isLoadingProducts = false;
      this.calcularResumen();
    }
  }

  // Funciones de cálculo
  private calcularTotalSinDescuento(cartItems: any[]): number {
    return cartItems.reduce((sum: number, item: any) => 
      sum + (item.price * (item.cantidad || 1)), 0
    );
  }

  private calcularTotalConDescuento(totalSinDescuento: number, descuento: number): number {
    return totalSinDescuento - descuento;
  }

  private calcularCantidadTotal(cartItems: any[]): number {
    return cartItems.reduce((sum: number, item: any) => sum + (item.cantidad || 1), 0);
  }

  private formatearPrecio(precio: number): string {
    return precio.toFixed(2) + ' €';
  }

  calcularResumen(): void {
    const cartItems = this.data?.cartItems || this.cartItems || [];

    if (cartItems.length === 0) {
      this.cantidad = 0;
      this.precio = '0.00 €';
      this.descuentoFormateado = '0.00 €';
      this.total = '0.00 €';
      return;
    }

    const totalSinDescuento = this.calcularTotalSinDescuento(cartItems);
    
    // Calcular descuento automáticamente si el total supera 500€
    let descuentoCalculado = 0;
    if (totalSinDescuento > 500) {
      descuentoCalculado = totalSinDescuento * 0.05; // 5% de descuento
    }
    
    // Usar el descuento calculado o el que viene del input
    const descuento = descuentoCalculado > 0 ? descuentoCalculado : (this.data?.descuento || this.descuento || 0);
    const totalConDescuento = this.calcularTotalConDescuento(totalSinDescuento, descuento);

    // Actualizar el descuento en data para que se use en la compra
    if (this.data) {
      this.data.descuento = descuento;
    }
    this.descuento = descuento;

    this.cantidad = this.calcularCantidadTotal(cartItems);
    this.precio = this.formatearPrecio(totalSinDescuento);
    this.descuentoFormateado = this.formatearPrecio(descuento);
    this.total = this.formatearPrecio(totalConDescuento);
  }

  // Funciones de Stripe
  private async inicializarStripe(): Promise<Stripe | null> {
    return await loadStripe('pk_test_51SrGR5J33eynDJCSzzIvVxA7jveO7pram7dH2Fi6qozeWEbCNd1KLuTPATzZxo4BhYlX4jEFrU9ZzWOaDVewqGnw00Bk9QQg2d');
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.show) return;
    await this.inicializarStripeYElementos();
  }

  private async inicializarStripeYElementos(): Promise<void> {
    try {
      this.stripe = await this.inicializarStripe();

      if (!this.stripe) {
        this.messageNoUserDisplay = this.getText(
          'Error al inicializar Stripe',
          'Error initializing Stripe'
        );
        this.isLoading = false;
        return;
      }

      if (this.userId) {
        this.apiService.showProfile(this.userId).subscribe({
          next: (user: any) => {
            this.email = user.email || '';
          },
          error: () => {
            console.warn('No se pudo obtener el email del usuario');
          }
        });
      }

      setTimeout(() => {
        if (this.show && this.cardNumberElement && this.cardExpiryElement && this.cardCvcElement) {
          this.inicializarElementos();
        } else {
          setTimeout(() => {
            if (this.show && this.cardNumberElement && this.cardExpiryElement && this.cardCvcElement) {
              this.inicializarElementos();
            }
          }, 200);
        }
      }, 300);

    } catch (error: any) {
      console.error('Error en inicializarStripeYElementos:', error);
      this.messageNoUserDisplay = this.getText(
        'Error al inicializar Stripe',
        'Error initializing Stripe'
      );
      this.isLoading = false;
    }
  }

  private async inicializarElementos(): Promise<void> {
    if (!this.stripe || !this.cardNumberElement || !this.cardExpiryElement || !this.cardCvcElement) {
      return;
    }

    try {
      this.elements = this.stripe.elements({
        appearance: { theme: 'stripe' }
      });

      this.cardNumber = this.elements.create('cardNumber', {
        placeholder: '1234 1234 1234 1234'
      });
      this.cardNumber.mount(this.cardNumberElement.nativeElement);

      this.cardExpiry = this.elements.create('cardExpiry', {
        placeholder: 'MM/AA'
      });
      this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
      
      this.cardNumber.on('change', (event: any) => {
        if (event.empty) {
          this.cardBrand = null; 
        } else {
          this.cardBrand = event.brand;
        }
      });
      this.cardCvc = this.elements.create('cardCvc', {
        placeholder: 'CVV'
      });
      this.cardCvc.mount(this.cardCvcElement.nativeElement);

      this.isLoading = false;

    } catch (error: any) {
      console.error('Error al inicializar elementos:', error);
      this.messageNoUserDisplay = this.getText(
        'Error al inicializar el formulario de pago: ' + error.message,
        'Error initializing payment form: ' + error.message
      );
      this.isLoading = false;
    }
  }

  // Validar email
  private validarEmail(email: string): { isValid: boolean; message: string | null } {
    if (!email || !email.includes('@')) {
      return { isValid: false, message: this.getText('Email inválido', 'Invalid email') };
    }
    return { isValid: true, message: null };
  }

  onEmailInput(): void {
    this.emailErrors = '';
  }

  onEmailBlur(): void {
    if (!this.email) return;
    const { isValid, message } = this.validarEmail(this.email);
    if (!isValid && message) {
      this.emailErrors = message;
    }
  }

  private checkCartStatus(): void {
    if (!this.userId) {
      this.isLoading = false;
      return;
    }

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

  private manejarPagoExitoso(res: any): void {
    this.limpiarElementos();
    this.show = false;
    this.showAlert = true;
    this.apiService.clearCart();
    this.hasItemsInCart = false;
    
    setTimeout(() => {
      this.showAlert = false;
      if (this.dialogRef) {
        this.dialogRef.close(true);
      }
      this.confirm.emit();
      this.isProcessing = false;
      this.isLoading = false;
      this.router.navigate(['/show-buys']);
    }, 1000);
  }

  private manejarErrorPago(err: any): void {
    console.error(err);
    const mensajeError = err.error?.error || err.error?.mensaje || 'Desconocido';
    this.messageNoUserDisplay = this.getText(
      'Error al procesar el pago: ' + mensajeError,
      'Error processing payment: ' + mensajeError
    );
    this.isLoading = false;
    this.isProcessing = false;
  }

  async pagar(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }

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

    const { isValid, message } = this.validarEmail(this.email);
    if (!isValid) {
      this.emailErrors = message || '';
      this.messageNoUserDisplay = message || '';
      return;
    }

    if (!this.stripe || !this.cardNumber || !this.cardExpiry || !this.cardCvc) {
      this.messageNoUserDisplay = this.getText(
        'Error: Stripe no inicializado',
        'Error: Stripe not initialized'
      );
      return;
    }

    if (!this.nombreCompleto.trim()) {
      this.messageNoUserDisplay = this.getText(
        'El nombre completo es requerido',
        'Full name is required'
      );
      return;
    }

    if (!this.direccion.trim()) {
      this.messageNoUserDisplay = this.getText(
        'La dirección es requerida',
        'Address is required'
      );
      return;
    }

    this.setLoading(true);
    this.messageNoUserDisplay = this.getText(
      'Procesando pago...',
      'Processing payment...'
    );

    try {
      const { error: submitError, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardNumber,
        billing_details: {
          name: this.nombreCompleto,
          email: this.email,
          address: {
            line1: this.direccion,
            city: this.ciudad,
            postal_code: this.codigoPostal,
            country: this.pais
          }
        }
      });

      if (submitError) {
        this.showMessage(submitError.message || this.getText('Error al procesar el pago', 'Error processing payment'));
        this.setLoading(false);
        return;
      }

      if (!paymentMethod) {
        this.showMessage(this.getText('Error al crear el método de pago', 'Error creating payment method'));
        this.setLoading(false);
        return;
      }

      this.apiService.getCartByUsuarioId(this.userId).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.carrito) {
            const purchase = {
              productos: response.carrito.map((producto: any) => ({
                productoId: producto.id,
                cantidad: producto.cantidad || 1
              })),
              descuento: this.data?.descuento || this.descuento || 0,
              payment_method_id: paymentMethod.id,
              stripe_product_id: 'prod_default'
            };

            this.apiService.makePurchase(purchase, this.userId!).subscribe({
              next: (res: any) => {
                console.log('Respuesta del servidor en makePurchase:', res);
                if (res.mensaje === 'Compra registrada') {
                  // Eliminar cada producto del carrito
                  purchase.productos.forEach((producto: { productoId: number; cantidad: number }) => {
                    this.apiService.eliminarDelCarrito(producto.productoId).subscribe();
                  });
                  
                  this.manejarPagoExitoso(res);
                } else {
                  this.messageNoUserDisplay = this.getText(
                    'Error al realizar la compra',
                    'Error making purchase'
                  );
                  this.setLoading(false);
                }
              },
              error: (err: any) => this.manejarErrorPago(err)
            });
          } else {
            this.messageNoUserDisplay = this.getText(
              'Error al obtener el carrito',
              'Error getting cart'
            );
            this.setLoading(false);
          }
        },
        error: (error) => {
          console.error('Error al obtener el carrito:', error);
          this.messageNoUserDisplay = this.getText(
            'Error al verificar el carrito',
            'Error checking cart'
          );
          this.setLoading(false);
        }
      });
    } catch (error: any) {
      this.showMessage(error.message || this.getText('Error al procesar el pago', 'Error processing payment'));
      this.setLoading(false);
    }
  }

  private setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.isProcessing = isLoading;
  }

  private showMessage(messageText: string): void {
    this.messageNoUserDisplay = messageText;
    setTimeout(() => {
      this.messageNoUserDisplay = '';
    }, 4000);
  }

  onCancel(): void {
    this.limpiarElementos();
    this.show = false;
    this.showAlertCancel = true;
    setTimeout(() => {
      this.showAlertCancel = false;
      if (this.dialogRef) {
        this.dialogRef.close(false);
      }
      this.cancel.emit();
    }, 1000);
  }

  private limpiarElementos(): void {
    if (this.cardNumber) {
      try {
        this.cardNumber.unmount();
      } catch (e) {
        console.warn('Error al desmontar card number element:', e);
      }
      this.cardNumber = null;
    }
    if (this.cardExpiry) {
      try {
        this.cardExpiry.unmount();
      } catch (e) {
        console.warn('Error al desmontar card expiry element:', e);
      }
      this.cardExpiry = null;
    }
    if (this.cardCvc) {
      try {
        this.cardCvc.unmount();
      } catch (e) {
        console.warn('Error al desmontar card cvc element:', e);
      }
      this.cardCvc = null;
    }
    this.elements = null;
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  getCartItems(): any[] {
    return this.data?.cartItems || this.cartItems || [];
  }


  onCardChange(event: any) {
    this.cardBrand = event.brand;
  }
}
