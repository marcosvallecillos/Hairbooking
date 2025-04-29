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
          this.apiService.removeFavorite(product.id);
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
      this.messageNoUserDisplay = this.messageNoUser = this.getText('Deberas iniciar sesion para realizar esta función','You must log in to do this function.'); ;
      setTimeout(() => {
        this.messageNoUserDisplay = null;
      }, 2000);
      return;
    }
    // Cambiar el estado de favorite
    product.insidecart = !product.insidecart;
    console.log(product.name, 'se ha añadido al carrito');
    // Actualizar el producto en la base de datos
    this.apiService.updateProductCart(product.id, product.insidecart ? true : false).subscribe({
      next: (response: any) => {
        if (product.insidecart) {
          this.apiService.addCart({ ...product });
        } else {
          this.apiService.removeCart(product.id);
        }
      },
      error: (error: any) => {
        console.error('Error al actualizar carrito:', error);
        // Revertir el cambio si hay error
        product.insidecart = !product.insidecart;
        this.messageNoUserDisplay = this.getText(
          'Error al actualizar carrito',
          'Error updating cart'
        );
      }
    });
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
