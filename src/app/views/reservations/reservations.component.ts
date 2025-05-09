import { Component } from '@angular/core';
import { Reserva } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgClass } from '@angular/common';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';

@Component({
  selector: 'app-reservations',
  imports: [FooterComponent,NgClass,ModalUserComponent,RouterLink],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent {
 reserves: Reserva[] = [];
  isSpanish: boolean = true;
  isLoading: boolean = false;
  showLoginModal: boolean = false;
  selectedUserId: number | null = null;
  
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
deleteReserve(reserveId: number) { // Anula la reserva 
  this.apiService.deleteReserve(reserveId).subscribe({
    next: () => {
      console.log('Reserva eliminada con éxito');
      this.getAllReserves(); 
    },
    error: (error) => {
      console.error('Error al eliminar la reserva:', error);
    }
  });
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

  isReservePast(reserve: Reserva): boolean {
    const [year, month, day] = reserve.dia.split('-').map(Number);
    const [hours, minutes] = reserve.hora.split(':').map(Number);
    
    const reserveDate = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    
    return reserveDate < now;
  }

}
