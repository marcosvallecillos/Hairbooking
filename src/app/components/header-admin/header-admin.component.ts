import { Component, HostListener } from '@angular/core';
import { Product } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-admin',
  imports: [ RouterLink, RouterLinkActive],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
  isSpanish: boolean = true;
  productos: Product[] = [];
  isMenuOpen: boolean = false;
  mostrarHeader: boolean = false;
  showCarritoModal: boolean = false;
  isAuthenticated: boolean = true;
  cartItemsCount: number = 0;

  constructor(
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => (this.isSpanish = isSpanish)
    );

    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.isAuthenticated = true;
      this.mostrarHeader = user.name === 'admin';
    } else {
      this.isAuthenticated = false;
      this.mostrarHeader = false;
    }
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.mostrarHeader = this.router.url !== '/index';
    });

    // Suscribirse al observable de cartItemsCount
    this.apiService.cartItemsCount$.subscribe((count) => {
      this.cartItemsCount = count !== null && count !== undefined ? count : 0;
    });

    // Opcional: inicializar con el valor actual
    this.cartItemsCount = this.apiService.cartItemsCount.value || 0;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  isUser: boolean = true;

  signout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    this.isUser = false;
    console.log('cerrando sesion')
    this.isAuthenticated = false;
    this.router.navigate(['/home-barber']);
    window.location.reload()
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }


}
