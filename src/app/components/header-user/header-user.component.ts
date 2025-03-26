import { Component, HostListener } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent {
  isSpanish: boolean = true;
  isMenuOpen: boolean = false;
  mostrarHeader: boolean = false;
  
  isAuthenticated: boolean = true;
  constructor(private languageService: LanguageService, private route: ActivatedRoute, private router: Router) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  
    const userData = localStorage.getItem('userData');
    this.isAuthenticated = !!userData; 
  }
  ngOnInit() {

    this.router.events.subscribe(() => {
      this.mostrarHeader = this.router.url !== '/index'; 
    });
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
    // Elimina los datos del usuario del almacenamiento local
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    this.isUser = false; 
    this.isAuthenticated = false; 
        window.location.reload(); 
  
}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const navbar = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');

    // Cierra el menú si el clic ocurre fuera del navbar y del botón toggler
    if (this.isMenuOpen && navbar && !navbar.contains(target) && !toggler?.contains(target)) {
      this.isMenuOpen = false;
    }
  }@HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
}
