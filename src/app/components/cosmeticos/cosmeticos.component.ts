import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-cosmeticos',
  imports: [RouterLink],
  templateUrl: './cosmeticos.component.html',
  styleUrl: './cosmeticos.component.css'
})
export class CosmeticosComponent {
 isSpanish: boolean = true;
  
    constructor(private languageService: LanguageService,private router:Router, private route:ActivatedRoute) {
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
      this.route.queryParams.subscribe((params) => {
        const category = params['category'] || 'all';
        this.filterProducts(category);
      });
    }
  
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }


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
          }, {
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
        trimmer: [
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
          name: 'Difusor de Agua ',
          price: '9,99€',
          image: '../../../../images/cosmeticos/difusor.png',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 6,
          name: 'Cera de Pelo ',
          price: '2,99€',
          image: '../../../../images/cosmeticos/cera.png',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 7,
          name: 'Champú para barba ',
          price: '2,99€',
          image: '../../../../images/cosmeticos/champu_barba.png',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 8,
          name: 'Aceite para Barba ',
          price: "18.99€",
          image: '../../../../images/aceite.png',
          isFavorite: false,
          insidecart: false,
        }
      ],
      mobiliaro: [
        {
          id: 9,
          name: 'Sillón de barberia negra ',
          price: "250 €",
          image: '../../../../images/mobiliario/sillon_negro.jpg',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 9,
          name: 'Sillón de barberia blanca ',
          price: "279,99 €",
          image: '../../../../images/mobiliario/sillon_blanco.jpg',
          isFavorite: false,
          insidecart: false,
        }, {
  
          id: 10,
          name: 'Sillón de barberia negra con toques dorados ',
          price: "279,99 €",
          image: '../../../../images/mobiliario/sillon_dorado.jpg',
          isFavorite: false,
          insidecart: false,
  
        }
  
      ],
      tijeras: [
        {
          id: 11,
          name: 'TIJERAS DE ENTRESACAR STUDIO TECNO (5,5 PULGADAS) ',
          price: "15,99 €",
          image: '../../../../images/tijeras/tijeras_5.5.jpg',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 12,
          name: 'Tijeras de corte (6 PULGADAS) ',
          price: "10,99 €",
          image: '../../../../images/tijeras/tijeras_6.jpg',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 13,
          name: 'Tijeras de corte academy pro chamaleon (6 PULGADAS) ',
          price: "10,99 €",
          image: '../../../../images/tijeras/tijeras_chamaleon.jpg',
          isFavorite: false,
          insidecart: false,
        }
      ],
      capas: [
        {
          id: 14,
          name: 'Capa Bape ',
          price: "9,99 €",
          image: '../../../../images/capas/capa_bape.jpg',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 15,
          name: 'Capa negra con estampado ',
          price: "9,99 €",
          image: '../../../../images/capas/capa_lv.jpg',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 16,
          name: 'Capa negra  ',
          price: "9,99 €",
          image: '../../../../images/capas/capa3.jpg',
          isFavorite: false,
          insidecart: false,
        }
      ],
      accesorios: [
        {
          id: 17,
          name: 'Difusor de agua',
          price: "9,99 €",
          image: '../../../../images/accesorios/difusor.png',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 18,
          name: 'Espuma para pelo ',
          price: "1,99 €",
          image: '../../../../images/accesorios/espuma.png',
          isFavorite: false,
          insidecart: false,
        },
        {
          id: 19,
          name: 'Peine de puas  ',
          price: "2,99 €",
          image: '../../../../images/accesorios/peine.png',
          isFavorite: false,
          insidecart: false,
        },{
          id: 20,
          name: 'Peine Rulo  ',
          price: "3,99 €",
          image: '../../../../images/accesorios/peine_rulo.png',
          isFavorite: false,
          insidecart: false,
        },{
          id: 21,
          name: 'Cepillo Quitapelos  ',
          price: "2,99 €",
          image: '../../../../images/accesorios/quita_pelos.png',
          isFavorite: false,
          insidecart: false,
        },{
          id: 22,
          name: 'Secador de pelo  ',
          price: "14,99 €",
          image: '../../../../images/accesorios/secador.png',
          isFavorite: false,
          insidecart: false,
        }
  
      ]
    };

    
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
          ...this.products.mobiliaro,
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
        this.filteredProducts = this.products.mobiliaro;

        break;
      default:
        this.filteredProducts = [
          ...this.products.maquinas.clippers,
          ...this.products.maquinas.trimmer,
          ...this.products.cosmeticos,
          ...this.products.mobiliaro,
          ...this.products.tijeras,
          ...this.products.capas,
          ...this.products.accesorios
        ];;
    }
  }

  
}
