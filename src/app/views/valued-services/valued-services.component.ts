import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Valoracion, Reserva } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api-service.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgClass } from '@angular/common';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';
import { ModalShowReserveComponent } from '../../modal-show-reserve/modal-show-reserve.component';

@Component({
  selector: 'app-valued-services',
  standalone: true,
  imports: [FooterComponent, NgClass, ModalUserComponent, ModalShowReserveComponent],
  templateUrl: './valued-services.component.html',
  styleUrl: './valued-services.component.css'
})
export class ValuedServicesComponent implements OnInit {
  showUserModal: boolean = false;
  showReservaModal: boolean = false;
  valoraciones: Valoracion[] = [];
  isLoading: boolean = false;
  isSpanish: boolean = true;
  selectedReservaId: number | null = null;
  selectedUserId: number | null = null;
  selectedReserveId: number | null = null;
  selectedReserve: Reserva | null = null;

  constructor(
    private languageService: LanguageService, 
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  ngOnInit(): void {
    this.getAllValoraciones();
  }

  getAllValoraciones() {
    this.isLoading = true;
    this.apiService.getValoraciones().subscribe({
      next: (response) => {
        if (response && response.valoraciones) {
          this.valoraciones = response.valoraciones.map(valoracion => ({
            ...valoracion,
            usuario_id: valoracion.usuario?.id || valoracion.usuario_id,
            reserva_id: valoracion.reserva?.id || valoracion.reserva_id
          })).sort((a, b) => {
            if (a.usuario_id && b.usuario_id) {
              return a.usuario_id - b.usuario_id;
            }
            return 0;
          });
        } else {
          this.valoraciones = [];
        }
        this.isLoading = false;
        console.log('Valoraciones cargadas:', this.valoraciones);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al obtener valoraciones:', error);
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

  openUserModal(usuarioId: number) {
    this.selectedUserId = usuarioId;
    this.showUserModal = true;
  }

  openReservaModal(reservaId: number) {
    this.selectedReserveId = reservaId;
    this.showReservaModal = true;
    
    // Load reserve data
    this.apiService.getReserves().subscribe({
      next: (reserves) => {
        const reserve = reserves.find(r => r.id === reservaId);
        if (reserve) {
          this.selectedReserve = reserve;
          console.log('Reserva encontrada:', reserve);
        } else {
          console.error('No se encontró la reserva con ID:', reservaId);
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar datos de la reserva:', error);
      }
    });
  }

  closeUserModal() {
    this.showUserModal = false;
    this.cdr.detectChanges();
  }

  closeReservaModal() {
    this.showReservaModal = false;
    this.selectedReserve = null;
    this.cdr.detectChanges();
  }
}
