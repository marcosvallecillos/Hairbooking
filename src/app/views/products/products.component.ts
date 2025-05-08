import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Product } from '../../models/user.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-products',
  imports: [RouterLink,FooterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: {
    maquinas: { clippers: Product[]; trimmer: Product[] };
    cosmeticos: Product[];
    mobiliario: Product[];
    tijeras: Product[];
    capas: Product[];
    accesorios: Product[];
  } = {
    maquinas: { clippers: [], trimmer: [] },
    cosmeticos: [],
    mobiliario: [],
    tijeras: [],
    capas: [],
    accesorios: []
  };

  filteredProducts: Product[] = [];
  isLoading: boolean = true;

  isSpanish: boolean = true;
  isUser = false;
  constructor(
    private languageService: LanguageService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private userStateService: UserStateService
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit() {
    this.isUser = this.userStateService.getIsUser();
    
    this.apiService.getAllProductos().subscribe(
      (apiProducts: Product[]) => {
        //Categorizar a los productos
        apiProducts.forEach(product => {
          if (product.subcategorias === 'clippers') {
            this.products.maquinas.clippers.push(product);
          } else if (product.subcategorias === 'trimmer') {
            this.products.maquinas.trimmer.push(product);
          } else if (product.categorias === 'cosmeticos') {
            this.products.cosmeticos.push(product);
          } else if (product.categorias === 'mobiliario') {
            this.products.mobiliario.push(product);
          } else if (product.categorias === 'tijeras') {
            this.products.tijeras.push(product);
          } else if (product.categorias === 'capas') {
            this.products.capas.push(product);
          } else if (product.categorias === 'accesorios') {
            this.products.accesorios.push(product);
          }
        });

        this.filteredProducts = [
          ...this.products.maquinas.clippers,
          ...this.products.maquinas.trimmer,
          ...this.products.cosmeticos,
          ...this.products.mobiliario,
          ...this.products.tijeras,
          ...this.products.capas,
          ...this.products.accesorios
        ];

        // Verificar si los productos estan en favoritos o en el carrito
        this.userStateService.isUser$.subscribe(isUser => {
          this.isUser = isUser;
          if (isUser) {
            this.userStateService.user$.subscribe(user => {
              if (user && user.id) {
                // Cargar Favoritos
                this.apiService.getFavoritesByUsuarioId(user.id).subscribe({
                  next: (favoritesResponse: any) => {
                    if (favoritesResponse.status === 'success' && favoritesResponse.favoritos) {
                      const favoriteIds = favoritesResponse.favoritos.map((favoritos: any) => favoritos.id);
                      this.filteredProducts.forEach(product => {
                        product.favorite = favoriteIds.includes(product.id);
                      });
                    }
                  }
                });

                // Cargar Carrito
                this.apiService.getCartByUsuarioId(user.id).subscribe({
                  next: (cartResponse: any) => {
                    if (cartResponse.status === 'success' && cartResponse.carrito) {
                      const cartIds = cartResponse.carrito.map((carrito: any) => carrito.id);
                      this.filteredProducts.forEach(product => {
                        product.cart = cartIds.includes(product.id);
                      });
                    }
                    this.isLoading = false;
                  }
                });
              } else {
                this.isLoading = false;
              }
            });
          } else {
            this.isLoading = false;
          }
        });

        // Predeterminado saldra la categoria all
        this.route.queryParams.subscribe((params) => {
          const category = params['category'] || 'all';
          this.filterProducts(category);
        });
      },
      error => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    );
  }

  addToCart(product: Product) {
    if (!this.isUser) {
      this.messageNoUserDisplay = this.getText(
        'Debes iniciar sesión para añadir al carrito',
        'You must log in to add to cart'
      );
      return;
    }

    this.apiService.updateProductCart(product.id, true).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          // Actualizar el estado del producto en el array local
          const productIndex = this.filteredProducts.findIndex(p => p.id === product.id);
          if (productIndex !== -1) {
            this.filteredProducts[productIndex].cart = true;
          }
          this.message = `${product.name} ` + this.getText('ha sido añadido al carrito.', 'has been added to cart.');
        } else {
          this.message = this.getText(
            'Error al añadir al carrito',
            'Error adding to cart'
          );
        }
      },
      error: (error) => {
        console.error('Error al añadir al carrito:', error);
        this.message = this.getText(
          'Error al añadir al carrito',
          'Error adding to cart'
        );
      }
    });

    setTimeout(() => {
      this.message = null;
      this.messageNoUserDisplay = null;
    }, 2000);
  }

  showNoUserMessage() {
    this.messageNoUserDisplay = this.getText(
      'Deberás iniciar sesión para realizar esta función', 
      'You must log in to do this function.'
    );
    setTimeout(() => {
      this.messageNoUserDisplay = null;
    }, 2000);
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  messageNoUser: string = '';
  messageNoUserDisplay: string | null = null;

  favorite(product: Product): void {
    if (!this.isUser) {
      this.messageNoUserDisplay = this.getText('Deberás iniciar sesión para realizar esta función', 'You must log in to do this function.');
      setTimeout(() => {
        this.messageNoUserDisplay = null;
      }, 2000);
      return;
    }

    // Cambiar el estado de favorite
    product.favorite = !product.favorite;
    
    // Actualizar el producto en la base de datos
    this.apiService.updateProductFavorite(product.id, product.favorite ? true : false).subscribe({
      next: (response: any) => {
        if (product.favorite) {
          this.apiService.addFavorite({ ...product });
        } else {
          this.apiService.deleteProductFav(product.id);
        }
      },
      error: (error: any) => {
        console.error('Error al actualizar favorito:', error);
        // Revertir el cambio si hay error
        product.favorite = !product.favorite;
        this.messageNoUserDisplay = this.getText(
          'Error al actualizar favoritos',
          'Error updating favorites'
        );
      }
    });
  }

  cart: Product[] = [];
  message: string | null = null;
  messageTrue: string | null = null;

  productInCart(product: any) {
    if (!this.isUser) {
      this.messageNoUserDisplay = this.messageNoUser = this.getText(
        'Deberas iniciar sesion para realizar esta función',
        'You must log in to do this function.'
      );
      setTimeout(() => {
        this.messageNoUserDisplay = null;
      }, 2000);
      return;
    }

    // Cambiar el estado de cart
    product.cart = !product.cart;
    
    // Actualizar el estado en filteredProducts inmediatamente
    const productIndex = this.filteredProducts.findIndex(p => p.id === product.id);
    if (productIndex !== -1) {
      this.filteredProducts[productIndex].cart = product.cart;
    }
    
    // Actualizar el producto en la base de datos
    this.apiService.updateProductCart(product.id, product.cart).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          if (product.cart) {
            this.apiService.addCart({ ...product });
            this.message = `${product.name} ` + this.getText('ha sido añadido al carrito.', 'has been added to cart.');
          } else {
            this.apiService.deleteProductCart(product.id);
            this.message = `${product.name} ` + this.getText('ha sido eliminado del carrito.', 'has been removed from cart.');
          }
        } else {
          // Revertir el cambio si hay error
          product.cart = !product.cart;
          if (productIndex !== -1) {
            this.filteredProducts[productIndex].cart = product.cart;
          }
          this.message = this.getText(
            'Error al actualizar carrito',
            'Error updating cart'
          );
        }
      },
      error: (error: any) => {
        console.error('Error al actualizar carrito:', error);
        // Revertir el cambio si hay error
        product.cart = !product.cart;
        if (productIndex !== -1) {
          this.filteredProducts[productIndex].cart = product.cart;
        }
        this.message = this.getText(
          'Error al actualizar carrito',
          'Error updating cart'
        );
      }
    });

    setTimeout(() => {
      this.message = null;
      this.messageNoUserDisplay = null;
    }, 2000);
  }

  filterProducts(category: string) {
    switch (category) {
      case 'clippers':
        this.filteredProducts = this.products.maquinas.clippers;
        break;
      case 'trimmer':
        this.filteredProducts = this.products.maquinas.trimmer;
        break;
      case 'cosmeticos':
        this.filteredProducts = this.products.cosmeticos;
        break;
      case 'tijeras':
        this.filteredProducts = this.products.tijeras;
        break;
      case 'capas':
        this.filteredProducts = this.products.capas;
        break;
        case 'accesorios':
          this.filteredProducts = this.products.accesorios;
          break;

      case 'all':
        this.filteredProducts = [
          ...this.products.maquinas.clippers,
          ...this.products.maquinas.trimmer,
          ...this.products.cosmeticos,
          ...this.products.mobiliario,
          ...this.products.tijeras,
          ...this.products.capas,
          ...this.filteredProducts = this.products.accesorios
        ];
        break;
      case 'maquinas':
        this.filteredProducts = [
          ...this.products.maquinas.clippers,
          ...this.products.maquinas.trimmer

        ];
        break;
      case 'mobiliario':
        this.filteredProducts = this.products.mobiliario;

        break;
        
      default:
        this.filteredProducts = [
          ...this.products.maquinas.clippers,
          ...this.products.maquinas.trimmer,
          ...this.products.cosmeticos,
          ...this.products.mobiliario,
          ...this.products.tijeras,
          ...this.products.capas,
          ...this.products.accesorios
        ];;
    }
  }

}
