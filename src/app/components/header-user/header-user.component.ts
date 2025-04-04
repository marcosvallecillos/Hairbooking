import { Component, HostListener } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api-service.service';

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
  constructor(private languageService: LanguageService, private route: ActivatedRoute, private router: Router,private apiService:ApiService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  
    const userData = localStorage.getItem('userData');
    this.isAuthenticated = !!userData; 
  }
  cartItemsCount:number = 0;
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
    this.isAuthenticated = false; 
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
