import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule , ModalLoginComponent,HeaderComponent, FooterComponent, ModalComponent,RouterLink],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.css'
})
export class ReserveComponent {
  currentDate = new Date();
  selectedDate: Date | null = null;
  selectedService: string = '';
  selectedTime: string = '';
  showModal: boolean = false;

  services = [
    { name: 'Servicio a Domicilio', price: '50 €' },
    { name: 'Corte Degradado', price: '12 €' },
    { name: 'Mascarilla Puntos Negros', price: '10 €' },
    { name: 'Corte Degradado + Barba', price: '15 €' },
    { name: 'Corte + Mechas', price: '50 €' },
    { name: 'Corte Fuera Horario', price: '30 €' },
    { name: 'Arreglo Barba', price: '10 €' },
    { name: 'Corte + Cejas', price: '13 €' }
  ];

  availableHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];
  showLoginModal: boolean = false;
  getDaysInMonth(month: number, year: number): (Date | null)[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Ajustar el primer día de la semana (0 = Domingo, 1 = Lunes, etc.)
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;

    // Añadir días vacíos al inicio
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
  constructor(private authService: AuthService, private router: Router) {}
  isAuthenticated = true;
  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
}

redirectToLogin() {
    this.router.navigate(['/login']);
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
    // Lógica de reserva aquí
  }

  onCancelReserve() {
    this.showModal = false;
  }

  onReserve() {
    if (this.selectedDate && this.selectedService && this.selectedTime) {
      this.showModal = true;
    }
  }

  updateAvailableHours() {
    // Implementa la lógica para actualizar las horas disponibles basándote en la fecha seleccionada
  }
  openLoginModal() {
    this.showLoginModal = true;
  }
}
