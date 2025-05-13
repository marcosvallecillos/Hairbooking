import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: number;
}

@Component({
  selector: 'app-modal-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-reserve.component.html',
  styleUrl: './modal-reserve.component.css'
})
export class ModalReserveComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() fecha: string | null = '';
  @Input() hora: string = '';
  @Input() servicio: string = '';
  @Input() peluquero: string = '';
  @Input() precio?: string = '';
  @Input() usuario: number | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  showAlert: boolean = false;
  showAlertCancel: boolean = false;
  isSpanish: boolean = true;
  usuarios: Usuario[] = [];
  selectedUserId: number | null = null;
  isSubmitting: boolean = false;

  constructor(
    private languageService: LanguageService,
    private apiService: ApiService
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit() {
    this.getAllClients();
  }

  getAllClients() {

    this.apiService.getAllUsers().subscribe({
      next: (response) => {
        this.usuarios = response; 
        console.log('Clientes:', response);
      },
      error: (error) => {
        console.error('Error al obtener los clientes:', error);
      }
    });
  }
  formatearFecha(year: number, month: number, day: number): string {
    // Ensure month and day are padded with zeros if needed
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }
  onConfirm() {
    if (!this.selectedUserId || this.isSubmitting) return;

    this.isSubmitting = true;
    // Convertir la fecha al formato YYYY-MM-DD
    let formattedDate = '';
    if (this.fecha) {
      const dateObj = new Date(this.fecha);
      formattedDate = this.formatearFecha(
        dateObj.getFullYear(),
        dateObj.getMonth() + 1,
        dateObj.getDate()
      );
    }
  
    const reservaData = {
      servicio: this.servicio,
      peluquero: this.peluquero,
      dia: formattedDate,
      hora: this.hora,
      usuario_id: this.selectedUserId,
      precio: this.precio
    };
  
    this.apiService.newReserveByAdmin(reservaData).subscribe({
      next: (response) => {
        this.show = false;
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
          this.confirm.emit();
          this.isSubmitting = false;

        }, 1000);
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 0);
      },
      error: (error) => {
        // Manejo de error
        console.error('Error al crear reserva:', error);
        this.isSubmitting = false;
      }
    });
  }

  onCancel() {
    this.showAlertCancel = true;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    setTimeout(() => {
      this.showAlert = false;
      this.cancel.emit();
    }, 1000);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
}
