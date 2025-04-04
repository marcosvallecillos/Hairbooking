import { Component } from '@angular/core';
import { Product } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { ApiService } from '../../services/api-service.service';

@Component({
  selector: 'app-show-buys',
  imports: [RouterLink,FooterComponent],
  templateUrl: './show-buys.component.html',
  styleUrl: './show-buys.component.css'
})
export class ShowBuysComponent {
  productos: Product[] = []; 
  isUser = true;
  isAuthenticated = true;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private apiService: ApiService 
  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => (this.isSpanish = isSpanish)
    );
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.productos = this.apiService.getPurchases();
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }
}
