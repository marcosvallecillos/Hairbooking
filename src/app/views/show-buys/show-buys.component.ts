import { Component } from '@angular/core';
import { Product } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-show-buys',
  imports: [RouterLink,FooterComponent],
  templateUrl: './show-buys.component.html',
  styleUrl: './show-buys.component.css'
})
export class ShowBuysComponent {
    productos:Product[] = [
      {
        id: 1,
        name: 'CLIPPER SPACE X VERSACE ',
        price: 109.99 ,
        cantidad:1,
        image: '../../../../images/clipper/clipper_space.jpg',
        isFavorite: false,

      }, 
      {
        id: 2,
        name: 'CLIPPER WAHL VAPOR 5 STAR CORDLESS ',
        price: 159.99 ,
        cantidad:1,
        image: '../../../../images/clipper/clipper_wahl.jpg', 
        isFavorite: false,

      },
      {
        id: 3,
        name: 'Trimmer Skeleton ',
        price: 129.99 ,
        cantidad:1,
        image: '../../../../images/trimmer/trimmer_skeleton.jpg',
        isFavorite: false,

      } 
    ]
 
    isUser = true;
    isAuthenticated = true;
    isSpanish: boolean = true;
    showLoginModal: boolean = false;
    constructor(private authService: AuthService, private router: Router, private languageService: LanguageService) {
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
    }
    
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }
    ngOnInit() {
      this.isAuthenticated = this.authService.isLoggedIn();
  }
  openLoginModal() {
    this.showLoginModal = true;
  }

}
