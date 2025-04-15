import { Component } from '@angular/core';
import { Compra, Product } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { ApiService } from '../../services/api-service.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-show-buys',
  imports: [RouterLink,FooterComponent],
  templateUrl: './show-buys.component.html',
  styleUrl: './show-buys.component.css'
})
export class ShowBuysComponent {
  compras: Compra[] = []; 
  isUser = false;
  isAuthenticated = true;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private apiService: ApiService,
    private userStateService: UserStateService
  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => (this.isSpanish = isSpanish)
    );
  }

  ngOnInit() {
    this.compras = this.apiService.getPurchases();
    this.isUser = this.userStateService.getIsUser();
    this.userStateService.isUser$.subscribe(isUser => {
      this.isUser = isUser;
    });
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  calcularTotalCompra(compra: Product[]) {
    let total = 0;
    for (let i = 0; i < compra.length; i++) {
      total += compra[i].price * compra[i].cantidad;
    }
    let descuento = 0;
    let totalConDescuento = total;

    if (total > 500) {
      descuento = total * 0.05;
      totalConDescuento = total - descuento;
    }

    return { total, totalConDescuento, descuento };
  }
}
  
