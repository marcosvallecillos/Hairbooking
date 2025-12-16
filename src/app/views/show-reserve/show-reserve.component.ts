import { Component, HostListener, OnInit } from '@angular/core'; // Asegúrate de importar OnInit
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { ReserveComponent } from '../reserve/reserve.component';
import { Product, Reserva, Usuario, Valoracion } from '../../models/user.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { ApiService } from '../../services/api-service.service';
import { UserStateService } from '../../services/user-state.service';
import { ModalCodeComponent } from '../../components/modal-code/modal-code.component';

@Component({
  selector: 'app-show-reserve',
  standalone: true,
  imports: [ModalLoginComponent, RouterLink, FooterComponent, ModalDeleteComponent,ModalCodeComponent],
  templateUrl: './show-reserve.component.html',
  styleUrl: './show-reserve.component.css'
})
export class ShowReserveComponent implements OnInit {
  reserves: Reserva[] = [];
  isUser = false;
  usuario: Usuario | null = null;
  isAuthenticated = true;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;
  showModalCode: boolean = false;
  showModal: boolean = false;
  selectedReserve: Reserva | null = null;
  isLoading: boolean = true;
  codigoReserva: string = '';

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
    this.getNumeroReservasByUsuarioId();
    this.loadUserData();
  }

  private sortReserves(reservas: Reserva[]): Reserva[] {
    return reservas.sort((a, b) => {
      const ordenDia = a.dia.localeCompare(b.dia);
      return ordenDia !== 0 ? ordenDia : a.hora.localeCompare(b.hora);
    });
  }

  private mapReservaResponse(response: any[]): Reserva[] {
    return response.map((r: any) => ({
      ...r,
      usuarioId: r.usuarioId ?? r.usuario_id,
      valoracionId: r.valoracion ?? null,
      valoracionComentario: r.valoracion_comentario ?? null,
      valoracionServicio: r.valoracion_servicio ?? null,
      valoracionPeluquero: r.valoracion_peluquero ?? null,
    }) as Reserva);
  }

  loadUserReserves() {
    this.isLoading = true;
    const userId = this.authService.getUserId();

    if (!userId) {
      this.isLoading = false;
      return;
    }

    this.apiService.getReserveByUsuario(userId).subscribe({
      next: (response) => {
        const mapped = this.mapReservaResponse(response);
        this.reserves = this.sortReserves(mapped);
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error al cargar las reservas del usuario:', error);
        this.isLoading = false;
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

  deleteReserve(reserve: Reserva) {
    this.selectedReserve = reserve;
    this.showModal = true;
    console.log('Reserva seleccionada para eliminar:', reserve);
  }
  valoracion: Valoracion[] = [];

  onConfirmDelete() {
    if (this.selectedReserve) {
      const reserveId = this.selectedReserve.id;
      // Eliminamos solo la reserva, sin tocar la valoración
      this.deleteReservation(reserveId);
    }
  }

  private deleteReservation(reserveId: number) {
    this.apiService.deleteReserve(reserveId).subscribe({
      next: (response) => {
        this.reserves = this.reserves.filter(r => r.id !== reserveId);
        this.selectedReserve = null;
        this.showModal = false;
        console.log('Reserva eliminada y movida a reservas anuladas:', response);
      },
      error: (error: Error) => {
        console.error('Error al eliminar la reserva:', error);
      }
    });
  }
  reservasparaCorteGratis: number = 0;
  totalReservasUsuario: number = 0;

  getNumeroReservasByUsuarioId() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.apiService.getNumeroReservasByUsuarioId(userId).subscribe({
        next: (response) => {
          this.totalReservasUsuario = response.totalReservas;
          this.reservasparaCorteGratis = response.paraCorteGratis;
          console.log('Numero de reservas:', response);
        },
        error: (error: Error) => {
          console.error('Error al obtener el numero de reservas:', error);
        }
      });
   
    }
  }

  private loadUserDataInternal(callback?: (codigo: string) => void) {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getAllUsers().subscribe({
      next: (usuarios) => {
        const usuario = usuarios.find(u => u.id === userId);
        if (usuario) {
          this.usuario = usuario;
          const codigo = usuario.codigoCorteGratis || '';
          if (callback) callback(codigo);
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
      }
    });
  }

  loadUserData() {
    this.loadUserDataInternal((codigo) => {
      if (this.showModalCode) {
        this.codigoReserva = codigo;
      }
    });
  }

  openModalCode() {
    const getCodigoAndOpen = (codigo: string) => {
      this.codigoReserva = codigo;
      if (codigo) {
        this.showModalCode = true;
      }
    };

    if (this.usuario?.codigoCorteGratis) {
      getCodigoAndOpen(this.usuario.codigoCorteGratis);
    } else {
      this.loadUserDataInternal(getCodigoAndOpen);
    }
  }
  
  closeModalCode() {
    this.showModalCode = false;
    this.codigoReserva = '';
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
   showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  currentFilter: 'all' | 'activas' | 'expiradas' = 'all';
  filterError: string | null = null;
  
  filtrar(tipo: 'all' | 'activas' | 'expiradas') {
    this.isLoading = true;
    this.filterError = null;
    this.currentFilter = tipo;
    const userId = this.authService.getUserId();

    if (!userId) {
      this.filterError = this.getText(
        'Error: Usuario no autenticado',
        'Error: User not authenticated'
      );
      this.isLoading = false;
      return;
    }

    if (tipo === 'all') {
      this.loadUserReserves();
      return;
    }

    const filterMethod = tipo === 'activas' 
      ? this.apiService.filterReserveActivas()
      : this.apiService.filterReserveExpiradas();

    filterMethod.subscribe({
      next: (reservas) => {
        const filtered = reservas.filter(reserva => reserva.usuarioId === userId);
        this.reserves = this.sortReserves(filtered);
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.showDropdown = false;
    }
  }
}
