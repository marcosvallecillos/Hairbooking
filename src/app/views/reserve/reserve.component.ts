import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
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
export class ReserveComponent implements OnInit {
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
    '09:00', '09:30', '10:00', '10:24', '11:00', '11:37',
    '12:00', '12:30', '13:00  ', '13:43', '14:10', '14:26',
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
      next: (response) => {
        this.reserves = response;
            this.reserves = response.sort((reserva, newreserve) => {
          const dayComparison = reserva.dia.localeCompare(newreserve.dia);
          if (dayComparison !== 0) {
            return dayComparison;
          }
        
          return reserva.hora.localeCompare(newreserve.hora);
        });

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
    return day === 0 || day === 6;
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
    const mm = (month < 10 ? '0' : '') + month;
    const dd = (day < 10 ? '0' : '') + day;
    return `${year}-${mm}-${dd}`;
  }
  
  onConfirmReserve() {
    this.showModal = false;
    const userId = this.authService.getUserId();
    if (this.selectedDate && this.selectedService && this.selectedBarber && this.selectedTime && userId) {
      // Formatear la fecha correctamente
      const year = this.selectedDate.getFullYear();
      const month = this.selectedDate.getMonth() + 1;
      const day = this.selectedDate.getDate();
      const formattedDate = this.formatearFecha(year, month, day);

      // Asegurarnos de que el precio sea un número

      const reserveData: Reserva = {
        id: this.isEditing ? this.reserveId! : Date.now(),
        servicio: this.selectedService,
        peluquero: this.selectedBarber,
        dia: formattedDate,
        hora: this.selectedTime,
        precio: this.getPrice(),
        usuario_id: userId,
        valoracion: null
      };

      if (this.isEditing && this.reserveId) {
        this.apiService.editReserve(this.reserveId, reserveData).subscribe({
          next: (response) => {
            this.router.navigate(['/show-reserve']);
          },
          error: (error) => {
            console.error('Error al actualizar la reserva:', error);
          }
        });
      } else {
        // Enviar a los dos endpoints por separado
        this.apiService.newReserve(reserveData).subscribe({
          next: (response) => {
            console.log('Primera reserva creada:', response);   
                this.router.navigate(['/show-reserve']);
          },
          error: (error) => {
            console.error('Error al guardar la reserva en el primer endpoint:', error);
          }
        });
      }
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