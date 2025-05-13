import { Component } from '@angular/core';
import { Reserva, Valoracion } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgClass } from '@angular/common';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-reservations',
  imports: [FooterComponent,NgClass,ModalUserComponent,RouterLink,ModalDeleteComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent {
  valoracion: Valoracion[]= [];
  selectedValoracion: Valoracion |null = null
 reserves: Reserva[] = [];
  isSpanish: boolean = true;
  isLoading: boolean = false;
  showLoginModal: boolean = false;
  selectedUserId: number | null = null;
  showModal: boolean = false;
  selectedReserve: Reserva | null = null;

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  ngOnInit(): void {
   this.getAllReserves();
   
  }
  getAllReserves() {
    this.isLoading = true;
    this.apiService.getReserves().subscribe({
      next: (response) => {
        this.reserves = response.sort((a, b) => {
          if (a.usuario && b.usuario) {
            return a.usuario.id - b.usuario.id;
          }
          return 0;
        });

        // Si hay pasado la hora se elimina la reserva 
        this.reserves.forEach(reserve => {
          if (this.isReservePast(reserve)) {
            this.deleteReserves(reserve.id);
          }
        });

        this.isLoading = false;
        console.log('Reservas ordenadas:', this.reserves);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al obtener reservas:', error);
      }
    });
  }

  openUserModal(usuarioId: number) {
    this.selectedUserId = usuarioId;
    this.showLoginModal = true;

    console.log(this.selectedUserId)
  }

  deleteReserve(reserve: Reserva) {
    this.selectedReserve = reserve;
    this.showModal = true;
    console.log('Reserva seleccionada para eliminar:', reserve);
  }

  deleteReserves(reserveId: number) { // se borra cuando ha pasado el tiempo
    this.apiService.deleteReserves(reserveId).subscribe({
      next: () => {
        console.log('Reserva eliminada con éxito');
        this.getAllReserves(); 
      },
      error: (error) => {
        console.error('Error al eliminar la reserva:', error);
      }
    });
    }
    deleteValorations(valoracion: Valoracion){
      if(valoracion.id){
        this.apiService.deleteValoracion(valoracion.id).subscribe({
          next: () => {
            console.log('Valoración eliminada con éxito');
            this.getAllReserves();
          },
          error: (error) => {
            console.error('Error al eliminar la valoración:', error);
          }
        });
      }
    }

  isReservePast(reserve: Reserva): boolean {
    const [year, month, day] = reserve.dia.split('-').map(Number);
    const [hours, minutes] = reserve.hora.split(':').map(Number);
    
    const reserveDate = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    
    return reserveDate < now;
  }
  onConfirmDelete() {
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
}
