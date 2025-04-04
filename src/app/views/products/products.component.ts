import { Component, Input } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Product, Productos } from '../../models/user.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service.service';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: {
    maquinas: { clippers: Productos[]; trimmer: Productos[] };
    cosmeticos: Productos[];
    mobiliario: Productos[];
    tijeras: Productos[];
    capas: Productos[];
    accesorios: Productos[];
  } = {
    maquinas: {
      clippers: [
        {
          id: 1,
          name: 'CLIPPER SPACE X VERSACE ',
          price: 109.99 ,
          image: '../../../../images/clipper/clipper_space.jpg',
          isFavorite: false,
          insidecart: false,
          cantidad: 1,
        },
        {
          id: 2,
          name: 'CLIPPER WAHL VAPOR 5 STAR CORDLESS ',
          price: 159.99,
          
          image: '../../../../images/clipper/clipper_wahl.jpg',
          isFavorite: false,
          insidecart: false,
          cantidad: 1,
        }, {
          id: 3,
          name: 'CLIPPER JRL ',
          price: 109.99,
          image: '../../../../images/clipper/clipper_jrl.jpg',
          isFavorite: false,
          insidecart: false,
          cantidad: 1,
        },
        {
          id: 4,
          name: 'CLIPPER Saber ',
          price: 159.99 ,
          image: '../../../../images/clipper/clipper_styleCraft.jpg',
          isFavorite: false,
          insidecart: false,
          cantidad: 1,
        },
      ],
      trimmer: [
        {
          id:5,
          name: 'Trimmer Skeleton ',
          price: 129.99 ,
          image: '../../../../images/trimmer/trimmer_skeleton.jpg',
          isFavorite: false,
          insidecart: false,
          cantidad: 1,
        },
        {
          id: 6,
          name: 'Trimmer Saber ',
          price: 179.99 ,
          image: '../../../../images/trimmer/trimmer_saber.jpg',
          isFavorite: false,
          insidecart: false,
          cantidad: 1,
        },{
          id: 26,
          name: 'Trimmer Chamaleon ',
          price: 175.99 ,
          image: '../../../../images/trimmer/trimmer_chamaleon.jpg',
          isFavorite: false,
          insidecart: false,
          cantidad: 1,
        }
      ]
    },
    cosmeticos: [
      {
        id: 7,
        name: 'Difusor de Agua ',
        price: 9.99,
        image: '../../../../images/cosmeticos/difusor.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 8,
        name: 'Cera de Pelo ',
        price: 2.99,
        image: '../../../../images/cosmeticos/cera.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 9,
        name: 'Champú para barba ',
        price: 2.99,
        image: '../../../../images/cosmeticos/champu_barba.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 10,
        name: 'Aceite para Barba ',
        price: 18.99,
        image: '../../../../images/aceite.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      }
    ],
    mobiliario: [
      {
        id: 11,
        name: 'Sillón de barberia negra ',
        price: 250 ,
        image: '../../../../images/mobiliario/sillon_negro.jpg',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 12,
        name: 'Sillón de barberia blanca ',
        price: 279.99,
        image: '../../../../images/mobiliario/sillon_blanco.jpg',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      }, {

        id: 12,
        name: 'Sillón de barberia negra con toques dorados ',
        price: 279.99,
        image: '../../../../images/mobiliario/sillon_dorado.jpg',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,

      }

    ],
    tijeras: [
      {
        id: 14,
        name: 'TIJERAS DE ENTRESACAR STUDIO TECNO (5,5 PULGADAS) ',
        price: 15.99 ,
        image: '../../../../images/tijeras/tijeras_5.5.jpg',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 15,
        name: 'Tijeras de corte (6 PULGADAS) ',
        price: 10.99,
        image: '../../../../images/tijeras/tijeras_6.jpg',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 16,
        name: 'Tijeras de corte academy pro chamaleon (6 PULGADAS) ',
        price: 10.99,
        image: '../../../../images/tijeras/tijeras_chamaleon.jpg',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      }
    ],
    capas: [
      {
        id: 17,
        name: 'Capa Bape ',
        price: 9.99,
        image: '../../../../images/capas/capa_bape.jpg',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 18,
        name: 'Capa negra con estampado ',
        price: 9.99,
        image: '../../../../images/capas/capa_lv.jpg',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 19,
        name: 'Capa negra  ',
        price: 9.99,
        image: '../../../../images/capas/capa3.jpg',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      }
    ],
    accesorios: [
      {
        id: 20,
        name: 'Difusor de agua',
        price: 9.99,
        image: '../../../../images/accesorios/difusor.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 21,
        name: 'Espuma para pelo ',
        price: 1.99 ,
        image: '../../../../images/accesorios/espuma.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },
      {
        id: 22,
        name: 'Peine de puas  ',
        price: 2.99 ,
        image: '../../../../images/accesorios/peine.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },{
        id: 23,
        name: 'Peine Rulo  ',
        price: 3.99 ,
        image: '../../../../images/accesorios/peine_rulo.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },{
        id: 24,
        name: 'Cepillo Quitapelos  ',
        price: 2.99,
        image: '../../../../images/accesorios/quita_pelos.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      },{
        id: 25,
        name: 'Secador de pelo  ',
        price: 14.99,
        image: '../../../../images/accesorios/secador.png',
        isFavorite: false,
        insidecart: false,
        cantidad: 1,
      }

    ]
  };

  isSpanish: boolean = true;
  isUser = true ;
  constructor(private languageService: LanguageService,private router: Router, private route:ActivatedRoute,private apiService:ApiService ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
    this.route.queryParams.subscribe((params) => {
      const category = params['category'] || 'all';
      this.filterProducts(category);
    });
  }

  addToCart(product: Productos) {
    this.apiService.addProduct({ ...product }) ; 
    console.log('se añadio al carrito')
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

  favorite(product: Productos): void {
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


  filteredProducts: any[] = this.products.maquinas.clippers;

  // Método para filtrar productos
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
