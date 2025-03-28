import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { LanguageService } from '../../services/language.service';
@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule , ModalLoginComponent, FooterComponent, ModalComponent,RouterLink],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.css'
})
export class ReserveComponent {
  currentDate = new Date();
  selectedDate: Date | null = null;
  selectedService: string = '';
  selectedBarber: string = '';
  selectedTime: string = '';
  showModal: boolean = false;
  showAlert:boolean = false;
  selectedPeluquero: string = '';
  @Output() close = new EventEmitter<void>();
  errorMessage: string = '';
  services = [
    //es
    { nombre: 'Mascarilla Puntos Negros', precio: '10 €', name: 'Blackhead Mask', price: '10 €' },
    { nombre: 'Arreglo Barba', precio: '10 €' , name: 'Beard arrangement', price: '10 €'  },
    { nombre: 'Corte Degradado', precio: '12 €' , name: 'Fade Cut', price: '12 €' },
    { nombre: ' Degradado + Barba', precio: '15 €' , name: 'Fade Cut + Beard', price: '15 €' },
    { nombre: 'Corte + Cejas', precio: '13 €' , name: 'Cut + Eyebrows', price: '13 €'  },
    { nombre: 'Corte Fuera Horario', precio: '30 €' , name: 'Cut After Hours', price: '30 €' },
    { nombre: 'Corte + Mechas', precio: '50 €' ,  name: 'Cut + Highlights', price: '50 €'},
    { nombre: 'Servicio a Domicilio', precio: '50 €' , name: 'Home Delivery', price: '50 €' },

    //en

  ];

  availableHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];
  babers = [
    {name: 'Jesus',imagen: '../../../../images/barber1.jpg', descripcion: 'Peluquero Principal', description: 'Master Barber'},
    { name: 'Miguel',imagen: '../../../../images/colorista.jpg',descripcion: 'Colorista' ,description:'Color Specialist'},
    { name: 'Leo',imagen: '../../../../images/barber2.jpg',descripcion: 'Ayudante' , description: 'Assistant'}

  ]
 isSpanish: boolean = true;

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  showLoginModal: boolean = false;
  getDaysInMonth(month: number, year: number): (Date | null)[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Ajustar el primer día de la semana (0 = Domingo, 1 = Lunes, etc.)
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;

    // Dias vacios
    for (let i = 1; i < firstDayOfWeek; i++) {
        days.push(null);
    }

    // Añadir los días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }

    return days;
  }

  selectDate(date: Date) {
    if (this.isAvailable(date)) {
      this.selectedDate = new Date(date);
      this.updateAvailableHours();
    }
  }
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
 
  constructor(private authService: AuthService, private router: Router, private languageService: LanguageService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }
  isUser = false;
  isAuthenticated = true;
   
  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
}

redirectToLogin() {
    this.router.navigate(['/show-profile']);
}
  isAvailable(date: Date): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && !this.isWeekend(date);
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 7; 
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentDate = new Date(this.currentDate);
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.currentDate = new Date(this.currentDate);
  }

  onConfirmReserve() {
    this.showModal = false;
    if (this.selectedDate && this.selectedService  && this.selectedBarber && this.selectedTime) {
      console.log('Datos de la reserva:', {
        peluquero: this.selectedBarber,
        servicio: this.selectedService,
        fecha: this.selectedDate,
        hora: this.selectedTime,
      });
    this.router.navigate(['/showProfile']); 
    }
  }

  onCancelReserve() {
    this.showModal = false;
    window.location.reload();

  }

  onReserve() {
   
        this.showModal = true;
    }
  onSelectBarber(barber: string) {
    this.selectedBarber = barber;
  }

  updateAvailableHours() {
    // Implementa la lógica para actualizar las horas disponibles basándote en la fecha seleccionada
  }
  openLoginModal() {
    this.showLoginModal = true;
  }
  onClose() {
    this.close.emit();
    console.log('le estas dando');
  }
  clearSelectedDate() {
    this.selectedDate = null; // Asigna null en lugar de una cadena vacía
    console.log('Fecha deseleccionada');
  }
  }