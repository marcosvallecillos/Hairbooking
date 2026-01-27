import { Component, HostListener } from '@angular/core';
import { Reserva, Usuario, Valoracion } from '../../models/user.interface';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgClass } from '@angular/common';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { AuthService } from '../../services/auth.service';
import { ModalDeleteallComponent } from '../../components/modal-deleteall/modal-deleteall.component';

@Component({
  selector: 'app-reservations',
  imports: [FooterComponent,NgClass,ModalUserComponent,RouterLink,ModalDeleteComponent,ModalDeleteallComponent],
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
  showModalDeleteAll:boolean = false;
  selectedReserve: Reserva | null = null;
  currentFilter: 'all' | 'activas' | 'expiradas' = 'all';
  filterError: string | null = null;
  // user para almacenar el total de reservas por usuario_id
  reservasPorUsuario: { [usuarioId: number]: number } = {};
  // user para acceder rápidamente a los datos del usuario por id
  usuariosPorId: { [usuarioId: number]: Usuario } = {};

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
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
    this.cargarUsuarios();
  }
  getAllReservations() {
    this.isLoading = true;
    this.apiService.getReserves().subscribe({ 
      next: (response) => {
        const mapped = response.map((r: any) => ({
          ...r,
          usuarioId: r.usuarioId ?? r.usuario_id,
          valoracionId: r.valoracion ?? null,
          valoracionComentario: r.valoracion_comentario ?? null,
          valoracionServicio: r.valoracion_servicio ?? null,
          valoracionPeluquero: r.valoracion_peluquero ?? null,
        }) as Reserva);

        this.reserves = mapped.sort((reserva, newreserve) => {
          const ordenardia = reserva.dia.localeCompare(newreserve.dia);
          return ordenardia !== 0 ? ordenardia : reserva.hora.localeCompare(newreserve.hora);
        });

        this.calcularReservasPorUsuario();
        this.enlazarUsuariosAReservas();

        this.reserves.forEach(reserve => {
          if (this.isReservePast(reserve) && reserve.valoracionId != null) {
            this.deleteReserve(reserve);
          } 
        });

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al obtener reservas:', error);
      }
    });
  }

  private cargarUsuarios() {
    this.apiService.getAllUsers().subscribe({
      next: (usuarios) => {
        const user: { [usuarioId: number]: Usuario } = {};
        usuarios.forEach((u) => {
          if (u.id != null) {
            user[u.id] = u;
          }
        });
        this.usuariosPorId = user;
        this.enlazarUsuariosAReservas();
      },
      error: (error) => {
        console.error('Error al cargar usuarios para las reservas:', error);
      }
    });
  }

  private enlazarUsuariosAReservas() {
    if (!this.reserves?.length || !this.usuariosPorId) {
      return;
    }
    this.reserves = this.reserves.map((reserve) => ({
      ...reserve,
      usuario: reserve.usuarioId != null ? this.usuariosPorId[reserve.usuarioId] : reserve.usuario,
    }));
  }

  openUserModal(usuarioId: number) {
    this.selectedUserId = usuarioId;
    this.showLoginModal = true;
  }

  deleteReserve(reserve: Reserva) {
    this.selectedReserve = reserve;
    this.showModal = true;
  }
  deleteReserveAll(){
    console.log("Abriendo modal")
    this.showModalDeleteAll = true
    
  }


   
  private deleteReservation(reserveId: number) {
    this.apiService.deleteReserve(reserveId).subscribe({
      next: () => {
        this.reserves = this.reserves.filter(r => r.id !== reserveId);
        this.calcularReservasPorUsuario();
        this.selectedReserve = null;
        this.showModal = false;
      },
      error: (error: Error) => {
        console.error('Error al eliminar la reserva:', error);
      }
    });
  }
  private deleteAllReserves() {
    this.apiService.deleteAllReserves().subscribe({
      next: () => {
        this.getAllReservations();
      },
      error: (error) => {
        console.error('Error al eliminar todas las reservas:', error);
      }
    });
  }

  // Calcula cuántas reservas tiene cada usuario (por usuario_id)
  // Incluye tanto reservas activas como borradas usando el endpoint del backend
  private calcularReservasPorUsuario() {
    const usuarioIdsUnicos = new Set<number>();
    this.reserves.forEach((reserve) => {
      if (reserve.usuarioId != null) {
        usuarioIdsUnicos.add(reserve.usuarioId);
      }
    });

    if (usuarioIdsUnicos.size === 0) {
      this.reservasPorUsuario = {};
      return;
    }

    const conteo: { [usuarioId: number]: number } = {};
    const usuarioIdsArray = Array.from(usuarioIdsUnicos);
    let llamadasCompletadas = 0;
    const totalLlamadas = usuarioIdsArray.length;

    usuarioIdsArray.forEach((usuarioId) => {
      this.apiService.getNumeroReservasByUsuarioId(usuarioId).subscribe({
        next: (respuesta) => {
          conteo[usuarioId] = respuesta.totalReservas || 0;
          llamadasCompletadas++;
          
          if (llamadasCompletadas === totalLlamadas) {
            this.reservasPorUsuario = conteo;
          }
        },
        error: (error) => {
          console.error(`Error al obtener reservas para usuario ${usuarioId}:`, error);
          conteo[usuarioId] = 0;
          llamadasCompletadas++;
          
          if (llamadasCompletadas === totalLlamadas) {
            this.reservasPorUsuario = conteo;
          }
        }
      });
    });
  }

  isReservePast(reserve: Reserva): boolean {
    const [year, month, day] = reserve.dia.split('-').map(Number);
    const [hours, minutes] = reserve.hora.split(':').map(Number);
    const reserveDate = new Date(year, month - 1, day, hours, minutes);
    return reserveDate < new Date();
  }

  allReservesPast(): boolean {
    return this.reserves.length > 0 && this.reserves.every(reserve => this.isReservePast(reserve));
  }
  deleteValoracion(reserveId: number) {
    if (this.selectedReserve && typeof this.selectedReserve.valoracionId === 'number') {
      this.apiService.deleteValoracion(this.selectedReserve.valoracionId).subscribe({
        error: (error) => console.error('Error al eliminar valoración:', error)
      });
    }
  }
  onConfirmDelete() {
    if (this.selectedReserve) {
      this.deleteReservation(this.selectedReserve.id);
    }
  }

  onCancelReserve() {
    this.showModal = false;
    this.selectedReserve = null;
  }

  onConfirmDeleteAll() {
    console.log("Abriendo modal")
    this.deleteAllReserves();
  }

  onCancelDeleteAll() {
    this.showModalDeleteAll = false;
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
        const mapped = reservas.map((r: any) => ({
          ...r,
          usuarioId: r.usuarioId ?? r.usuario_id,
          valoracionId: r.valoracion ?? null,
          valoracionComentario: r.valoracion_comentario ?? null,
          valoracionServicio: r.valoracion_servicio ?? null,
          valoracionPeluquero: r.valoracion_peluquero ?? null,
        }) as Reserva);

        this.reserves = mapped.sort((reserva, newreserve) => {
          const ordenardia = reserva.dia.localeCompare(newreserve.dia);
          return ordenardia !== 0 ? ordenardia : reserva.hora.localeCompare(newreserve.hora);
        });

        this.calcularReservasPorUsuario();
        this.enlazarUsuariosAReservas();
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
