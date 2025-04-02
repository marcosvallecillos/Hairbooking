import { Component } from '@angular/core';
import { Usuario } from '../../models/user.interface';
import { Router, RouterLink } from '@angular/router';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { FooterComponent } from '../footer/footer.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-show-profile',
  imports: [RouterLink,ModalLoginComponent,FooterComponent],
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.css'
})
export class ShowProfileComponent {
  usuario: Usuario | null = null;

  showLoginModal: boolean = false;
  showModal: boolean = false;

  openLoginModal() {
    this.showLoginModal = true;
  }

   isSpanish: boolean = true;
  
    constructor(private languageService: LanguageService) {
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
    }
  
    toggleLanguage(language: 'es' | 'en') {
      this.languageService.setLanguage(language);
      localStorage.setItem('language', language);
    }
  
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }
}
