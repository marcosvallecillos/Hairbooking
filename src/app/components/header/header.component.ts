import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { AboutUsComponent } from '../../views/about-us/about-us.component';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { ProductsComponent } from '../../views/products/products.component';
import { ApiService } from '../../services/api-service.service';
import { ModalCarritoComponent } from '../modal-carrito/modal-carrito.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ModalLoginComponent,
    ProductsComponent,
    ModalCarritoComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {mostrarHeader: boolean = true;
 
  showCarritoModal: boolean = false;
  isSpanish: boolean = true;
  isMenuOpen: boolean = false;
  showLoginModal: boolean = false;

  cartItemsCount:number = 0;

  
  constructor(private languageService: LanguageService, 
    private route: ActivatedRoute,
    private router: Router,
    private apiService:ApiService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }
  ngOnInit() {

    this.router.events.subscribe(() => {
      this.mostrarHeader = this.router.url !== '/index'; 
    });this.apiService.cartItemsCount.subscribe((count) => {
      this.cartItemsCount = count;
    });
    this.apiService.cartItemsCount.subscribe((count) => {
      // Asegurarse de que cartItemsCount sea 0 cuando no hay ítems
      this.cartItemsCount = count !== null && count !== undefined ? count : 0;
    });
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  showRegisterModal: boolean = false;

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openRegisterModal() {
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }
closeCarritoModal() {
  this.showCarritoModal = false;
}

openCarritoModal() {
  this.showCarritoModal = true;
}
}
