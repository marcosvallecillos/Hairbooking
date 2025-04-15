import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/user.interface';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { LanguageService } from '../../services/language.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-show-profile',
  imports: [FormsModule, FooterComponent, ModalLoginComponent],
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.css'
})
export class ShowProfileComponent implements OnInit {
  usuario: Usuario | null = null;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private userStateService: UserStateService
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit() {
    this.checkUserSession();
  }

  checkUserSession() {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        this.usuario = JSON.parse(userDataStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.usuario = null;
        this.router.navigate(['/home-barber']);
      }
    } else {
      this.usuario = null;
      this.router.navigate(['/home-barber']);
    }
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  editarPerfil() {
    this.router.navigate(['/editProfile']);
  }

  cerrarSesion() {
    localStorage.removeItem('userData');
    this.usuario = null;
    this.router.navigate(['/home-barber']);
    window.location.reload()
  }
}
