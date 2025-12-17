import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api-service.service';
import { Reserva, Usuario } from '../../models/user.interface';

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalLoginComponent, FooterComponent, ModalComponent, RouterLink, ClipboardModule],
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
})
export class ReserveComponent implements OnInit {
  currentDate = new Date();
  reserves: Reserva[] = [];
  usuario: Usuario | null = null;
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
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00  ', '13:30', '14:00', '14:30',
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
    private route: ActivatedRoute,
    private clipboard: Clipboard
  ) {
    this.languageService.isSpanish$.subscribe((isSpanish) => (this.isSpanish = isSpanish));
  }

  isUser = true;
  isAuthenticated = true;
  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.loadReserves();
    this.loadUserCode();

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

  // Devuelve el precio original sin descuento
  getOriginalPrice(): number {
    const selected = this.services.find(service => service.nombre === this.selectedService);
    if (!selected) return 0;
    const numeric = parseFloat(selected.precio.replace('€', '').replace(' ', ''));
    return isNaN(numeric) ? 0 : numeric;
  }

  // Devuelve el precio final (con descuento si hay código de corte gratis)
  getPrice(): number {
    const originalPrice = this.getOriginalPrice();
    // Si hay código de corte gratis, el precio es 0
    if (this.codigoDisplay && this.codigoDisplay.trim() !== '') {
      return 0;
    }
    // Asegurar que siempre devolvamos un número válido
    return originalPrice || 0;
  }

  // Verifica si hay descuento aplicado
  hasDiscount(): boolean {
    return !!(this.codigoDisplay && this.codigoDisplay.trim() !== '');
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
        precio: this.getPrice(),          // number
        usuarioId: userId,
        usuario: undefined,
        valoracionId: null,
        valoracionComentario: null,
        valoracionServicio: null,
        valoracionPeluquero: null
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
        // Obtener el precio original y el precio final
        const precioOriginal = this.getOriginalPrice();
        const precioFinal = this.hasDiscount() ? 0 : precioOriginal;
        
        // Validar que el precio sea un número válido
        const precioAEnviar = Number(precioFinal);
        if (isNaN(precioAEnviar) || precioAEnviar < 0) {
          console.error('Error: El precio no es un número válido', precioAEnviar);
          return;
        }
        
        // Mapear al formato que espera el backend (usuario_id, precio numérico)
        const reserva: any = {
          servicio: reserveData.servicio,
          peluquero: reserveData.peluquero,
          dia: reserveData.dia,
          hora: reserveData.hora,
          usuario_id: reserveData.usuarioId,
          precio: precioAEnviar
        };

        // Si hay código de corte gratis, también enviar el código para que el backend lo valide
        if (this.hasDiscount() && this.codigoDisplay) {
          reserva.codigo_corte_gratis = this.codigoDisplay;
        }

        console.log('Enviando reserva:', reserva);
        console.log('Precio original:', precioOriginal, 'Precio final:', precioAEnviar);
        console.log('Tiene código de corte gratis:', this.hasDiscount());

        this.apiService.newReserve(reserva).subscribe({
          next: (response) => {
            if (this.hasDiscount() && this.codigoDisplay) {
              this.apiService.usarCodigoCorteGratis(userId, this.codigoDisplay).subscribe({
                next: () => {
                  console.log('Código de corte gratis consumido correctamente');
                  this.codigoDisplay = '';
                  if(this.usuario?.codigoCorteGratis == null){
                    console.log('Se ha eliminado el codigo')
                  }
                },
                error: (err) => {
                  console.error('Error al consumir el código:', err);
                }
              });
            }
            console.log('Reserva creada exitosamente:', response);   
            this.router.navigate(['/show-reserve']);
          },
          error: (error) => {
            console.error('Error al guardar la reserva:', error);
            console.error('Datos enviados:', reserva);
            if (error.error) {
              console.error('Error del servidor:', error.error);
            }
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

  codigoDisplay: string = '';
  copiado = false;

  loadUserCode() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.apiService.getAllUsers().subscribe({
      next: (usuarios) => {
        const usuario = usuarios.find(u => u.id === userId);
        if (usuario?.codigoCorteGratis) {
          this.codigoDisplay = usuario.codigoCorteGratis;
        }
      },
      error: (error) => {
        console.error('Error al cargar el código de corte gratis:', error);
      }
    });
  }

  copiarCodigo() {
    if (!this.codigoDisplay) return;

    if (this.clipboard.copy(this.codigoDisplay)) {
      this.copiado = true;
      setTimeout(() => this.copiado = false, 2000);
    }
  }
  /*
  verificarCodigo(){
    const userId = this.authService.getUserId();
    const codigo = this.usuario?.codigoCorteGratis || this.codigoReserva || '';

    if (userId && codigo) {
      this.apiService.usarCodigoCorteGratis(userId, codigo).subscribe({
        next: (response: any) => {
          console.log('Respuesta usarCodigoCorteGratis:', response);
          // Aquí ajusta según lo que devuelva tu backend
          this.totalReservasUsuario = response.totalReservas ?? this.totalReservasUsuario;
          this.reservasparaCorteGratis = response.paraCorteGratis ?? this.reservasparaCorteGratis;
        },
        error: (error: Error) => {
          console.error('Error al usar el código de corte gratis:', error);
        }
      });
    } else {
      console.warn('No hay userId o código de corte gratis disponible para verificar.');
    }
  }*/
}