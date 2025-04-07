import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { ReserveComponent } from '../reserve/reserve.component';
import { Product, Reserva } from '../../models/user.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { ApiService } from '../../services/api-service.service';

@Component({
  selector: 'app-show-reserve',
  imports: [ModalLoginComponent, ReserveComponent, RouterLink, FooterComponent, ModalDeleteComponent],
  templateUrl: './show-reserve.component.html',
  styleUrl: './show-reserve.component.css'
})
export class ShowReserveComponent {
  reserves: Reserva[] = [];

  isUser = false;
  isAuthenticated = true;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;
  showModal: boolean = false;
  selectedReserve: Reserva | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private apiService:ApiService
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }
  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.reserves = this.apiService.getReserves();
    this.isUser = this.apiService.getIsUser();
  }


  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  onReserve(reserve: Reserva) {
    this.selectedReserve = reserve;
    this.showModal = true;
  }

  onConfirmReserve() {
    if (this.selectedReserve) {
      this.reserves = this.reserves.filter(r => r.id !== this.selectedReserve!.id);
      this.selectedReserve = null;
    }
    this.showModal = false;
  }

  onCancelReserve() {
    this.showModal = false;
    this.selectedReserve = null;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }
}