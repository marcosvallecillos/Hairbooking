import { Component, Input } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Product } from '../../models/user.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products = {
    maquinas: {
      clippers: [
        {
          id: 1,
          name: 'CLIPPER SPACE X VERSACE ',
          price: "109,99 €",
          image: '../../../../images/clipper/clipper_space.jpg',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 2,
          name: 'CLIPPER WAHL VAPOR 5 STAR CORDLESS ',
          price: " 159,99 €",
          image: '../../../../images/clipper/clipper_wahl.jpg',
          isFavorite: false,
          insidecart: false,
        },{
        id: 1,
        name: 'CLIPPER SPACE X VERSACE ',
        price: "109,99 €",
        image: '../../../../images/clipper/clipper_space.jpg',
        isFavorite: false,
        insidecart: false,
      },
      {
        id: 2,
        name: 'CLIPPER WAHL VAPOR 5 STAR CORDLESS ',
        price: " 159,99 €",
        image: '../../../../images/clipper/clipper_wahl.jpg',
        isFavorite: false,
        insidecart: false,
      },
      
      ],
       trimmer:[
        {
          id: 1,
          name: 'Trimmer Skeleton ',
          price: "129,99 €",
          image: '../../../../images/trimmer/trimmer_skeleton.jpg',
          isFavorite: false,
        },
        {
          id: 2,
          name: 'Shaver Wad ',
          price: "59,99 €",
          image: '../../../../images/shaver/shaver.jpg',
          isFavorite: false,
          insidecart: false,
        },
      ]
    },
    cosmeticos: [
      {
        id: 5,
        name: 'Difusor de Agua',
        price: '9,99€',
        image: '../../../../images/cosmeticos/difusor.png',
        isFavorite: false,
        insidecart: false,
      },
      {
        id:6,
        name: 'Cera de Pelo',
        price: '2,99€',
        image: '../../../../images/cosmeticos/cera.png',
        isFavorite: false,
        insidecart: false,
      },
      {
        id: 7,
        name: 'Champú para barba',
        price: '2,99€',
        image: '../../../../images/cosmeticos/champu_barba.png',
        isFavorite: false,
        insidecart: false,
      },
      {
        id:8,
        name: 'Aceite para Barba',
        price: "18.99€",
        image: '../../../../images/aceite.png',
        isFavorite: false,
        insidecart: false,
      }
    ],
    mobiliaro:[
      {
        id:9,
        name: 'Sillón de barberia negra',
        price: "250 €",
        image: '../../../../images/sillon_negro.jpg',
        isFavorite: false,
        insidecart: false,
      },
      {
        id:9,
        name: 'Sillón de barberia blanca',
        price: "279,99 €",
        image: '../../../../images/sillon_blanco.jpg',
        isFavorite: false,
        insidecart: false,
      }

    ]
  };

  isSpanish: boolean = true;

  constructor(private languageService: LanguageService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  fav: Product[] = [];
  messageFavorite:string | null = null;
  messageNoFavorite:string | null = null;
  favorite(product: any): void {
    const isFavorites = this.fav.find(item => item.id === product.id);
    product.isFavorite = !product.isFavorite;
    if (isFavorites) {
      this.messageFavorite = `${product.name} ` + this.getText('ha sido eliminado de favoritos','has been removed from favorites');
    } else {
      product.isFavorite = true;
      this.fav.push(product);
      this.messageNoFavorite = `${product.name} ` + this.getText('ha sido añadido a favoritos','has been added to the favorites');
    }
    setTimeout(() => {
      this.messageFavorite = null
      this.messageNoFavorite = null
    }, 2000);
  }

  cart: Product[] = [];
  message: string | null = null;
  messageTrue:string | null = null;
  productInCart(product: any) {
    const productInCart = this.cart.find(item => item.id === product.id);
  
    if (productInCart) {
      this.messageTrue = `${product.name} ` + this.getText('ya está en el carrito.','it´s already in the cart') ; 
    } else {
      product.insidecart = true;
      this.cart.push(product);
      this.message = `${product.name}` + this.getText('ha sido añadido al carrito.','has been added to the cart.'); 
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
     
      case 'all':
        this.filteredProducts = [
          ...this.products.maquinas.clippers,
          ...this.products.maquinas.trimmer,
          ...this.products.cosmeticos,
          ...this.products.mobiliaro
        ];
        break;
        case 'maquinas':
          this.filteredProducts = [
            ...this.products.maquinas.clippers,
            ...this.products.maquinas.trimmer
            
          ];
          break;
          case 'mobiliario':
            this.filteredProducts = this.products.mobiliaro;
             
            break;
      default:
        this.filteredProducts =[
          ...this.products.maquinas.clippers,
          ...this.products.maquinas.trimmer,
          ...this.products.cosmeticos,
          ...this.products.mobiliaro
        ];;
    }
  }

}
