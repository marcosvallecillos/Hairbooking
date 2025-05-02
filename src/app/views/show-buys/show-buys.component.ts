import { Component, OnInit } from '@angular/core';
import { Compra } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { ApiService } from '../../services/api-service.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-show-buys',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './show-buys.component.html',
  styleUrl: './show-buys.component.css'
})
export class ShowBuysComponent implements OnInit {
  compras: any[] = [];
  loading = true;
  isUser = false;
  isAuthenticated = true;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;
  userId: number | null = null;
  isLoading: boolean = true; // Renombrado a isLoading

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private apiService: ApiService,
    private userStateService: UserStateService,
  ) {
    this.languageService.isSpanish$.subscribe(
      (isSpanish) => (this.isSpanish = isSpanish)
    );
  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.loadCompras();
    }
    this.isUser = this.userStateService.getIsUser();
    this.userStateService.isUser$.subscribe(isUser => {
      this.isUser = isUser;
    });
  }

  loadCompras() {
    this.loading = true;
    this.apiService.getHistorialCompras(this.userId!).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.compras) {
          // Filtrar solo la compra que tiene detalles
          this.compras = response.compras.filter((compra: any) => 
            compra.detalles && compra.detalles.length > 0
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las compras:', error);
        this.loading = false;
      }
    });
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  calcularTotalCompra(compra: Compra) {
    return {
      total: compra.total,
      cantidadTotal: compra.cantidadTotal
    };
  }

  calcularDescuento(total: number): number {
    if (total > 500) {
      return total * 0.05; // 5% de descuento si el total es mayor a 500€
    }
    return 0;
  }
}
  
