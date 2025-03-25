import { Component } from '@angular/core';
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

  constructor(private languageService: LanguageService, private route: ActivatedRoute, private router: Router) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
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

  logout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}

