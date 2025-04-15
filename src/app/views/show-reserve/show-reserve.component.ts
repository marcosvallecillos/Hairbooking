import { Component, OnInit } from '@angular/core'; // Asegúrate de importar OnInit
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { ReserveComponent } from '../reserve/reserve.component';
import { Product, Reserva } from '../../models/user.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { ApiService } from '../../services/api-service.service';
import { UserStateService } from '../../services/user-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-reserve',
  standalone: true,
  imports: [ModalLoginComponent, ReserveComponent, RouterLink, FooterComponent, ModalDeleteComponent],
  templateUrl: './show-reserve.component.html',
  styleUrl: './show-reserve.component.css'
})
export class ShowReserveComponent implements OnInit {
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
    private apiService: ApiService,
    private userStateService: UserStateService
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.isUser = this.userStateService.getIsUser();
    this.userStateService.isUser$.subscribe(isUser => {
      this.isUser = isUser;
    });
    this.loadUserReserves();
  }

  loadUserReserves() {
    const userId = this.authService.getUserId();
    console.log('Id del Usuario', userId);
    
    if (userId) {
      // Obtener las reservas del usuario directamente
      this.apiService.getReserveByUsuario(userId).subscribe({
        next: (reserves: Reserva[]) => {
          this.reserves = reserves;
          console.log('Reservas del usuario:', reserves);
        },
        error: (error: Error) => {
          console.error('Error al cargar las reservas del usuario:', error);
        }
      });
    }
  }

  deleteReserve(reserve: Reserva) {
    this.selectedReserve = reserve;
    this.showModal = true;
  }

  onConfirmReserve() {
    if (this.selectedReserve) {
      const reserveId = this.selectedReserve.id;
      this.apiService.deleteReserve(reserveId).subscribe({
        next: () => {
          this.reserves = this.reserves.filter(r => r.id !== reserveId);
          this.selectedReserve = null;
          this.showModal = false;
        },
        error: (error: Error) => {
          console.error('Error al eliminar la reserva', error);
        }
      });
    }
  }

  onCancelReserve() {
    this.showModal = false;
    this.selectedReserve = null;
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }
}
