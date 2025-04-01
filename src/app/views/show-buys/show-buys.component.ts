import { Component } from '@angular/core';
import { Product } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-show-buys',
  imports: [RouterLink],
  templateUrl: './show-buys.component.html',
  styleUrl: './show-buys.component.css'
})
export class ShowBuysComponent {
    productos = [
      {
        id: 1,
        name: 'CLIPPER SPACE X VERSACE ',
        price: '109,99€' ,
        image: '../../../../images/clipper/clipper_space.jpg',
      }, {
        id: 1,
        name: 'CLIPPER SPACE X VERSACE ',
        price: '109,99€' ,
        image: '../../../../images/clipper/clipper_space.jpg',
      }, {
        id: 1,
        name: 'CLIPPER SPACE X VERSACE ',
        price: '109,99€' ,
        image: '../../../../images/clipper/clipper_space.jpg',
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
