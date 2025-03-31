import { Component } from '@angular/core';
import { Product } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-carrito',
  imports: [FooterComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  productos: Product[] = [ 
    {
        id: 1,
        name: 'CLIPPER SPACE X VERSACE',
        price: 109.99, 
        image: '../../../../images/clipper/clipper_space.jpg',
        cantidad: 1 
    },
    {
        id: 2, 
        name: 'CLIPPER GOLD EDITION',
        price: 129.99, 
        image: '../../../../images/clipper/clipper_wahl.jpg',
        cantidad: 1
    }
  ];

  subtotal: number = 0;
  
   isSpanish: boolean = true;
    
  constructor(private languageService: LanguageService) {
      this.languageService.isSpanish$.subscribe(
          isSpanish => this.isSpanish = isSpanish
      );
       this.productos.forEach(product => {
        this.subtotal += product.price * product.cantidad;
        this.subtotal = parseFloat(this.subtotal.toFixed(2));
    });
  }
  getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
  }  
    eliminarproduct(product:any){
      console.log('Articulo eliminado',product)
    }
   }
  