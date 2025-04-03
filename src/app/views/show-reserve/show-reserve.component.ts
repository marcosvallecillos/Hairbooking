import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { ReserveComponent } from '../reserve/reserve.component';
import { Product, Reserva } from '../../models/user.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-show-reserve',
  imports: [ModalLoginComponent, ReserveComponent, RouterLink, FooterComponent, ModalDeleteComponent],
  templateUrl: './show-reserve.component.html',
  styleUrl: './show-reserve.component.css'
})
export class ShowReserveComponent {
  reserves: Reserva[] = [
      {
        id: 1,
        nombre: 'Marcos',
        apellidos: 'Vallecillos Usagre',
        servicio: 'Degradado',
        peluquero: 'Jesus',
        dia: '1/04/2005',
        hora: '17:15',
      },
      {
        id: 2,
        nombre: 'pepe',
        apellidos: 'Vallecillos Usagre',
        servicio: 'Degradado',
        peluquero: 'Jesus',
        dia: '2/04/2025',
        hora: '11:15',
      },
      {
        id: 3,
        nombre: 'Raul',
        apellidos: 'Vallecillos Usagre',
        servicio: 'Degradado',
        peluquero: 'Jesus',
        dia: '4/04/2025',
        hora: '16:15',
      },
      {
        id: 4,
        nombre: 'Marcos',
        apellidos: 'Vallecillos Usagre',
        servicio: 'Degradado',
        peluquero: 'Jesus',
        dia: '7/04/2025',
        hora: '12:15',
      }
  ];

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
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }
  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
   
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  onReserve(reserve: Reserva) {
    this.selectedReserve = reserve;
    this.showModal = true;
  }

  onConfirmReserve() {
    if (this.selectedReserve) {
      this.reserves = this.reserves.filter(r => r.id !== this.selectedReserve!.id);
      this.selectedReserve = null;
    }
    this.showModal = false;
  }

  onCancelReserve() {
    this.showModal = false;
    this.selectedReserve = null;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }
}