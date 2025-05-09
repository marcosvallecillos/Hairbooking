import { Component } from '@angular/core';
import { ReservaAnulada } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { NgClass } from '@angular/common';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';

@Component({
  selector: 'app-cancelled-reserve',
  imports: [NgClass,ModalUserComponent],
  templateUrl: './cancelled-reserve.component.html',
  styleUrl: './cancelled-reserve.component.css'
})
export class CancelledReserveComponent {
  reservesCancelled: ReservaAnulada[] = [];
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
    
   this.getAllCancelled();

  }
  getAllCancelled() {
    this.isLoading = true;
    this.apiService.getReservasAnuladas().subscribe({
      next: (response) => {
        this.reservesCancelled = response /*.sort((a, b) => {
          if (a.usuario && b.usuario) {
            return a.usuario.id - b.usuario.id;
          }
          return 0;
        });*/
        this.isLoading = false;
        console.log('Reservas ordenadas:', this.reservesCancelled);
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
}
