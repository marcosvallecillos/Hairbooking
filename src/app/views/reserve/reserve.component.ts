import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api-service.service';
import { Reserva } from '../../models/user.interface';

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalLoginComponent, FooterComponent, ModalComponent, RouterLink],
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
})
export class ReserveComponent {
  currentDate = new Date();
  reserves: Reserva[] = [];
  selectedDate: Date | null = null;
  selectedService: string = '';
  selectedBarber: string = '';
  selectedTime: string = '';
  showModal: boolean = false;
  showLoginModal: boolean = false;
  isSpanish: boolean = true;

  services = [
    { nombre: 'Mascarilla Puntos Negros', precio: '10 €', name: 'Blackhead Mask' },
    { nombre: 'Arreglo Barba', precio: '10 €', name: 'Beard arrangement' },
    { nombre: 'Corte Degradado', precio: '12 €', name: 'Fade Cut' },
    { nombre: 'Degradado + Barba', precio: '15 €', name: 'Fade Cut + Beard' },
    { nombre: 'Corte + Cejas', precio: '13 €', name: 'Cut + Eyebrows' },
    { nombre: 'Corte Fuera Horario', precio: '30 €', name: 'Cut After Hours' },
    { nombre: 'Corte + Mechas', precio: '50 €', name: 'Cut + Highlights' },
    { nombre: 'Servicio a Domicilio', precio: '50 €', name: 'Home Delivery' },
  ];

  availableHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  ];

  babers = [
    { name: 'Jesus', imagen: '../../../../images/barber1.jpg', descripcion: 'Peluquero Principal', description: 'Master Barber' },
    { name: 'Miguel', imagen: '../../../../images/colorista.jpg', descripcion: 'Colorista', description: 'Color Specialist' },
    { name: 'Leo', imagen: '../../../../images/barber2.jpg', descripcion: 'Ayudante', description: 'Assistant' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private apiService: ApiService
  ) {
    this.languageService.isSpanish$.subscribe((isSpanish) => (this.isSpanish = isSpanish));
  }

  isUser = true;
  isAuthenticated = true;
  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.loadReserves();
  }

  loadReserves() {
    this.reserves = this.apiService.getReserves();
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  getPrice(): string {
    const selected = this.services.find(service => service.nombre === this.selectedService);
    return selected ? selected.precio : '';
  }

  getDaysInMonth(month: number, year: number): (Date | null)[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;
    for (let i = 1; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  }

  isAvailable(date: Date): boolean {
    if (!date || !this.selectedBarber) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;
    const isWeekendDay = this.isWeekend(date);
    const isFullyBooked = this.isDayFullyBooked(date);
    return !isPast && !isWeekendDay && !isFullyBooked;
  }

  isDayFullyBooked(date: Date): boolean {
    const dateStr = date.toLocaleDateString();
    const bookingsForDay = this.reserves.filter(reserve => 
      reserve.dia === dateStr && 
      reserve.peluquero === this.selectedBarber
    );
    return bookingsForDay.length >= this.availableHours.length;
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  isTimeReserved(time: string): boolean {

      // Verificar si una hora específica está disponible

    if (!this.selectedDate || !this.selectedBarber) return false;
    const dateStr = this.selectedDate.toLocaleDateString();
    return this.reserves.some(reserve => 
      reserve.dia === dateStr && 
      reserve.hora === time && 
      reserve.peluquero === this.selectedBarber
    );
  }

  isTimePast(time: string): boolean {
    if (!this.selectedDate) return false;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateStart = new Date(this.selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);

   
    if (selectedDateStart < today) {
      return true;
    }

    // Averiguar si la hora se ha pasado de la hora actual

    if (selectedDateStart.getTime() == today.getTime()) {
      const [hours, minutes] = time.split(':').map(Number);
      const slotDateTime = new Date(this.selectedDate);
      slotDateTime.setHours(hours, minutes, 0, 0);
      return slotDateTime <= now;
    }

    return false;
  }

  isTimeAvailable(time: string): boolean {
    return !this.isTimeReserved(time) && !this.isTimePast(time);
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
    if (this.selectedDate && this.selectedService && this.selectedBarber && this.selectedTime) {
      const reserveData: Reserva = {
        id: Date.now(),
        servicio: this.selectedService,
        peluquero: this.selectedBarber,
        dia: this.selectedDate.toLocaleDateString(),
        hora: this.selectedTime,
        precio: this.getPrice()
      };

      this.apiService.addReserve(reserveData);
      this.loadReserves();
      console.log('Reserva guardada:', reserveData);
      this.router.navigate(['/show-reserve']);
    }
  }

  onCancelReserve() {
    this.showModal = false;
    window.location.reload();
  }

  onReserve() {
    this.showModal = true;
  }

  selectService(service: string) {
    this.selectedService = this.selectedService === service ? '' : service;
  }

  selectBarber(barber: string) {
    this.selectedBarber = this.selectedBarber === barber ? '' : barber;
    this.selectedDate = null;
    this.selectedTime = '';
  }

  selectTime(time: string) {
    if (this.isTimeAvailable(time)) {
      this.selectedTime = this.selectedTime === time ? '' : time;
    }
  }

  selectDate(date: Date) {
    if (this.isAvailable(date)) {
      this.selectedDate = this.selectedDate?.getTime() === date.getTime() ? null : date;
      this.selectedTime = '';
    }
  }

  openLoginModal() {
    this.showLoginModal = true;
  }
}