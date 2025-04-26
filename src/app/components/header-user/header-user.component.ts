import { Component, HostListener } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api-service.service';
import { ModalCarritoComponent } from '../modal-carrito/modal-carrito.component';
import { Product } from '../../models/user.interface';
import { CarritoComponent } from '../../views/carrito/carrito.component';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalCarritoComponent,CarritoComponent,RouterLinkActive],
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent {
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
    private apiService: ApiService
  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => (this.isSpanish = isSpanish)
    );

    const userData = localStorage.getItem('userData');
    this.isAuthenticated = !!userData;
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

  closeCarritoModal() {
    this.showCarritoModal = false;
  }

  openCarritoModal() {
    this.showCarritoModal = true;
  }
}