import { Component, HostListener, OnInit } from '@angular/core';
import { Product } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-header-admin',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent implements OnInit {
  isSpanish: boolean = true;
  productos: Product[] = [];
  isMenuOpen: boolean = false;
  mostrarHeader: boolean = false;
  showCarritoModal: boolean = false;
  isAuthenticated: boolean = false;
  cartItemsCount: number = 0;
  isUser: boolean = false;

  constructor(
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private userStateService: UserStateService
  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => (this.isSpanish = isSpanish)
    );
  }

  ngOnInit() {
    // Inicializar el estado del idioma desde localStorage
    const savedLanguage = localStorage.getItem('language');
    this.isSpanish = savedLanguage ? savedLanguage === 'es' : true;

    // Suscribirse a los cambios de estado del usuario
    this.userStateService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.isUser = !!user;
      this.mostrarHeader = user?.rol === 'admin';
    });

    // Verificar el estado inicial
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.isAuthenticated = true;
      this.isUser = true;
      this.mostrarHeader = user.rol === 'admin';
    }

    // Suscribirse a los cambios de ruta
    this.router.events.subscribe(() => {
      this.userStateService.user$.subscribe(user => {
        if (user) {
          this.isAuthenticated = true;
          this.isUser = true;
          this.mostrarHeader = user.rol === 'admin';
        }
      });
    });

    // Suscribirse al observable de cartItemsCount
    this.apiService.cartItemsCount$.subscribe((count) => {
      this.cartItemsCount = count !== null && count !== undefined ? count : 0;
    });

    // Inicializar con el valor actual
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

  signout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    this.isUser = false;
    this.isAuthenticated = false;
    this.mostrarHeader = false;
    this.userStateService.clearUser();
    this.router.navigate(['/home-barber']);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
}
