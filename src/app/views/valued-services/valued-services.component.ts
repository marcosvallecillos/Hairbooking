import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Valoracion } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api-service.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgClass } from '@angular/common';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';

@Component({
  selector: 'app-valued-services',
  imports: [FooterComponent,NgClass,ModalUserComponent],
  templateUrl: './valued-services.component.html',
  styleUrl: './valued-services.component.css'
})
export class ValuedServicesComponent implements OnInit {
  showLoginModal: boolean = false;
  valoraciones:Valoracion[] = [];
  isLoading: boolean = false;
  isSpanish: boolean = true;
  selectedReservaId: number | null = null;
  selectedUserId: number | null = null;

  userId: number = 0;
    constructor(private languageService: LanguageService, private apiService: ApiService,private cdr: ChangeDetectorRef) {
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
        // Ordenar las valoraciones por ID de usuario
        this.valoraciones = response.valoraciones.sort((a, b) => {
          if (a.usuario && b.usuario) {
            return a.usuario.id - b.usuario.id;
          }
          return 0;
        });
        this.isLoading = false;
        console.log('Valoraciones ordenadas:', this.valoraciones);
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
    this.showLoginModal = true;
  }

  closeUserModal() {
    this.showLoginModal = false;
    this.cdr.detectChanges(); // Detectar cambios manualmente
    console.log('Modal cerrado');
    }
}
