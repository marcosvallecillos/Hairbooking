import { Component, OnInit } from '@angular/core'; // Asegúrate de importar OnInit
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { ReserveComponent } from '../reserve/reserve.component';
import { Product, Reserva, Valoracion } from '../../models/user.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { ApiService } from '../../services/api-service.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-show-reserve',
  standalone: true,
  imports: [ModalLoginComponent, RouterLink, FooterComponent, ModalDeleteComponent],
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
  isLoading: boolean = true;

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
    this.isLoading = true;
    const userId = this.authService.getUserId();
    console.log('Id del Usuario', userId);

    if (userId) {
      this.apiService.getReserveByUsuario(userId).subscribe({
        next: (reserves: Reserva[]) => {
          this.reserves = reserves;
          this.isLoading = false;
          console.log('Reservas del usuario:', reserves);
        },
        error: (error: Error) => {
          console.error('Error al cargar las reservas del usuario:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  isReservePast(reserve: Reserva): boolean {
    const [year, month, day] = reserve.dia.split('-').map(Number);
    const [hours, minutes] = reserve.hora.split(':').map(Number);

    const reserveDate = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();

    return reserveDate < now;
  }

  deleteReserve(reserve: Reserva) {
    this.selectedReserve = reserve;
    this.showModal = true;
    console.log('Reserva seleccionada para eliminar:', reserve);
  }
  valoracion: Valoracion[] = [];

  onConfirmDelete() {
    if (this.selectedReserve) {
      const reserveId = this.selectedReserve.id;
      
      // First, delete the rating if it exists
      if (this.selectedReserve.valoracion && typeof this.selectedReserve.valoracion === 'number') {
        this.apiService.deleteValoracion(this.selectedReserve.valoracion).subscribe({
          next: () => {
            // After rating is deleted, delete the reservation
            this.deleteReservation(reserveId);
          },
          error: (error: Error) => {
            console.error('Error al eliminar la valoración', error);
            // Even if rating deletion fails, try to delete the reservation
            this.deleteReservation(reserveId);
          }
        });
      } else {
        // If no rating exists, just delete the reservation
        this.deleteReservation(reserveId);
      }
    }
  }

  private deleteReservation(reserveId: number) {
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

  editReserve(reserve: Reserva) {
    if (this.isReservePast(reserve)) return;

    this.router.navigate(['/reserve'], {
      queryParams: {
        id: reserve.id,
        servicio: reserve.servicio,
        peluquero: reserve.peluquero,
        dia: reserve.dia,
        hora: reserve.hora
      }
    });
  }

  getStars(rating: number | null | undefined): string {
    if (rating === null || rating === undefined) {
      return '☆☆☆☆☆';
    }
    const fullStar = '★';
    const emptyStar = '☆';
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
  }
}
