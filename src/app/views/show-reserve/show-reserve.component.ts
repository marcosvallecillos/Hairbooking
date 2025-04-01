import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { ReserveComponent } from '../reserve/reserve.component';
import { Product, Reserva } from '../../models/user.interface';

@Component({
  selector: 'app-show-reserve',
  imports: [ModalLoginComponent,ReserveComponent,RouterLink],
  templateUrl: './show-reserve.component.html',
  styleUrl: './show-reserve.component.css'
})
export class ShowReserveComponent {
  
  isUser = true;
  isAuthenticated = true;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;
  constructor(private authService: AuthService, private router: Router, private languageService: LanguageService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }
  
  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
}
  reserves: Reserva[]= [
    {
      id:1,
      nombre: 'Marcos' ,
      apellidos: 'Vallecillos Usagre',
      servicio:'Degradado',
      peluquero:'Jesus',
      dia: '1/04/2005',
      hora: '17:15',
    },  {
      id:1,
      nombre: 'Marcos' ,
      apellidos: 'Vallecillos Usagre',
      servicio:'Degradado',
      peluquero:'Jesus',
      dia: '1/04/2025',
      hora: '17:15',
    },
    {
      id:1,
      nombre: 'Marcos' ,
      apellidos: 'Vallecillos Usagre',
      servicio:'Degradado',
      peluquero:'Jesus',
      dia: '1/04/2025',
      hora: '17:15',
    },{
      id:1,
      nombre: 'Marcos' ,
      apellidos: 'Vallecillos Usagre',
      servicio:'Degradado',
      peluquero:'Jesus',
      dia: '1/04/2025',
      hora: '17:15',
    }
    
  ]   
  openLoginModal() {
    this.showLoginModal = true;
  }
}
