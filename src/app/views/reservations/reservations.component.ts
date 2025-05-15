import { Component, HostListener } from '@angular/core';
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
  currentFilter: 'all' | 'activas' | 'expiradas' = 'all';
  filterError: string | null = null;

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
   this.getAllReservations();
   
  }
  getAllReservations() {
    this.isLoading = true;
    this.apiService.getReserves().subscribe({ 
      next: (response) => {
        this.reserves = response.sort((reserva, newreserve) => {
          const ordenardia = reserva.dia.localeCompare(newreserve.dia);
          if (ordenardia !== 0) {
            return ordenardia;
          }
        
          return reserva.hora.localeCompare(newreserve.hora);
        });

        // Se borra si la hora paso y la valoracion es distinta null
        this.reserves.forEach(reserve => {
          if (this.isReservePast(reserve) && reserve.valoracion != null) {
            console.log('Eliminando reserva pasada con valoración:', reserve);
            this.deleteValoracion(reserve.id);
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
    console.log('Abriendo modal :', reserve);
    
  }

  deleteReserves(reserveId: number) {
    this.apiService.deleteReserve(reserveId).subscribe({
      next: () => {
        console.log('Reserva eliminada con éxito');
        this.getAllReservations(); 
      },
      error: (error) => {
        console.error('Error al eliminar la reserva:', error);
      }
    });
    }

   
  private deleteReservation(reserveId: number) {
    this.apiService.deleteReserves(reserveId).subscribe({
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

  isReservePast(reserve: Reserva): boolean {
    const [year, month, day] = reserve.dia.split('-').map(Number);
    const [hours, minutes] = reserve.hora.split(':').map(Number);
    
    const reserveDate = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    
    return reserveDate < now;
  }
  deleteValoracion(reserveId:number){
      if (this.selectedReserve && typeof this.selectedReserve.valoracion === 'number'){
     this.apiService.deleteValoracion(reserveId);
     }
  }
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

  onCancelReserve() {
    this.showModal = false;
    this.selectedReserve = null;
  }

   showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  filtrar(tipo: 'all' | 'activas' | 'expiradas') {
    this.isLoading = true;
    this.filterError = null;
    this.currentFilter = tipo;

    if (tipo === 'all') {
      this.getAllReservations();
      return;
    }

    const filterMethod = tipo === 'activas' 
      ? this.apiService.filterReserveActivas()
      : this.apiService.filterReserveExpiradas();

    filterMethod.subscribe({
      next: (reservas) => {
        this.reserves = reservas;
        this.isLoading = false;
        this.showDropdown = false;
      },
      error: (error) => {
        console.error('Error al filtrar reservas:', error);
        this.filterError = this.getText(
          'Error al filtrar las reservas. Por favor, intente de nuevo.',
          'Error filtering reservations. Please try again.'
        );
        this.isLoading = false;
        this.showDropdown = false;
      }
    });
  }

  // Opcional: cerrar el menú si se hace clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.showDropdown = false;
    }
  }
}
