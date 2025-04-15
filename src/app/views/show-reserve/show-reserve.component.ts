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


  }

  loadUserReserves() {
    
    const userId = this.authService.getUserId();
    console.log('Id del Usuario', userId);
    
    if (userId) {
      // Obtener todas las reservas del usuario
      this.apiService.getReserves().forEach(reserve => {
        // Filtrar las reservas que pertenecen al usuario actual usando usuarioId
        if (reserve.usuarioId === userId) {
          this.reserves.push(reserve);
        }
      });
      
      // Si no hay reservas, intentar obtenerlas del backend
      if (this.reserves.length === 0) {
        this.apiService.getReserveByUsuario(userId).subscribe({
          next: (reserva: Reserva) => {
            if (reserva) {
              this.reserves = [reserva];
            }
          },
          error: err => {
            console.error('Error al cargar reservas', err);
          }
        });
      }
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
        },
        error: err => {
          console.error('Error al eliminar la reserva', err);
        }
      });
    }
    this.showModal = false;
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
