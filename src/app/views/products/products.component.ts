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
    this.userStateService.isUser$.subscribe(isUser => {
      this.isUser = isUser;
    });

    this.apiService.getAllProductos().subscribe(
      (apiProducts: Product[]) => {
        // Categorize products based on their type
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

        // Initialize filteredProducts with all products
        this.filteredProducts = [
          ...this.products.maquinas.clippers,
          ...this.products.maquinas.trimmer,
          ...this.products.cosmeticos,
          ...this.products.mobiliario,
          ...this.products.tijeras,
          ...this.products.capas,
          ...this.products.accesorios
        ];
        
        this.isLoading = false;
        
        // Subscribe to route params after products are loaded
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
   
    this.apiService.addProduct({ ...product }) ; 
    console.log('se añadio al carrito')
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
  messageFavorite: string | null = null;
  messageNoFavorite: string | null = null;
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

    product.isFavorite = !product.isFavorite;
    if (product.isFavorite) {
      this.apiService.addFavorite({ ...product });
      this.messageNoFavorite = `${product.name} ` + this.getText('ha sido añadido a favoritos', 'has been added to favorites');
    } else {
      this.apiService.removeFavorite(product.id);
      this.messageFavorite = `${product.name} ` + this.getText('ha sido eliminado de favoritos', 'has been removed from favorites');
    }

    setTimeout(() => {
      this.messageFavorite = null;
      this.messageNoFavorite = null;
    }, 2000);
  }

  cart: Product[] = [];
  message: string | null = null;
  messageTrue: string | null = null;
  productInCart(product: any) {
    if (!this.isUser) {
      this.messageNoUserDisplay = this.messageNoUser = this.getText('Deberas iniciar sesion para realizar esta función','You must log in to do this function.'); ;
      setTimeout(() => {
        this.messageNoUserDisplay = null;
      }, 2000);
      return;
    }
    const productInCart = this.cart.find(item => item.id === product.id);

    if (productInCart) {
      this.messageTrue = `${product.name} ` + this.getText('ya está en el carrito.', 'it´s already in the cart');
    } else {
      product.insidecart = true;
      this.cart.push(product);
      this.message = `${product.name}` + this.getText('ha sido añadido al carrito.', 'has been added to the cart.');
    }

    setTimeout(() => {
      this.messageTrue = null
      this.message = null;
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
