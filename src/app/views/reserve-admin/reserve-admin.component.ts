import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api-service.service';
import { Reserva } from '../../models/user.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalReserveComponent } from '../../components/modal-reserve/modal-reserve.component';

@Component({
  selector: 'app-reserve-admin',
  standalone: true,
  imports: [
    FooterComponent, 
    ModalLoginComponent,
    ModalReserveComponent, 
    CommonModule,
    FormsModule,
    ModalComponent
  ],
  templateUrl: './reserve-admin.component.html',
  styleUrl: './reserve-admin.component.css'
})
export class ReserveAdminComponent implements OnInit {

  currentDate = new Date();
  reserves: Reserva[] = [];
  selectedDate: Date | null = null;
  selectedService: string = '';
  selectedBarber: string = '';

  selectedTime: string = '';
  showModal: boolean = false;
  showLoginModal: boolean = false;
  isSpanish: boolean = true;
  isEditing: boolean = false;
  reserveId: number | null = null;
  isAdmin: boolean = false;
  selectedUserId: number | null = null;
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
    '09:00', '09:30', '10:00', '10:15', '11:00', '11:30',
    '11:55', '12:20', '13:00', '13:35', '16:00', '16:37',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  ];

  babers = [
    { name: 'Jesus', imagen: '../../../../images/barber1.jpg', descripcion: 'Peluquero Principal', description: 'Master Barber' },
    { name: 'Miguel', imagen: '../../../../images/colorista.jpg', descripcion: 'Colorista', description: 'Color Specialist' },
    { name: 'Leo', imagen: '../../../../images/barber2.jpg', descripcion: 'Ayudante', description: 'Assistant' },
  ];
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.languageService.isSpanish$.subscribe((isSpanish) => (this.isSpanish = isSpanish));
  }

  isUser = true;
  isAuthenticated = true;
  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.loadReserves();
    this.selectedUserId = this.authService.getUserId();

    // Verificar si hay parámetros de consulta para edición
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.reserveId = Number(params['id']);
        this.selectedService = params['servicio'] || '';
        this.selectedBarber = params['peluquero'] || '';
        if (params['dia']) {
          const [year, month, day] = params['dia'].split('-').map(Number);
          this.selectedDate = new Date(year, month - 1, day);
          this.currentDate = new Date(year, month - 1, 1);
         }
        this.selectedTime = params['hora'] || '';
      }
    });
    this.isLoading = false;
  }

  loadReserves() {
    this.apiService.getReserves().subscribe({
      next: (reserves) => {
        this.reserves = reserves;
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
      }
    });
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  getPrice(): string {
    const selected = this.services.find(service => service.nombre === this.selectedService);
    return selected ? selected.precio.replace(' €', '') : '';
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
    return day === 0 || day === 7;
  }

  isTimeReserved(time: string): boolean {
    if (!this.selectedDate || !this.selectedBarber) return false;

    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth() + 1;
    const day = this.selectedDate.getDate();
    const dateStr = this.formatearFecha(year, month, day);

    // Verificar si hay alguna reserva que coincida con la fecha, hora y peluquero
    const found = this.reserves.some(reserve =>
      reserve.dia === dateStr &&
      reserve.hora === time &&
      reserve.peluquero === this.selectedBarber
    );

    return found;
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
  formatearFecha(year: number, month: number, day: number): string {
    // Ensure month and day are padded with zeros if needed
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }
  
  onConfirmReserve() {
    this.showModal = false;
    this.loadReserves(); 
    this.router.navigate(['/reservations']);
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