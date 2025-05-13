import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { ApiService } from '../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-show-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-show-reserve.component.html',
  styleUrl: './modal-show-reserve.component.css'
})
export class ModalShowReserveComponent {
  @Input() show: boolean = false;
  @Input() id: number | null = null;
  @Input() servicio: string | null = '';
  @Input() peluquero: string | null = '';
  @Input() dia: string | null = '';
  @Input() hora: string | null = '';
  @Input() precio: string | null = '';
  @Output() close = new EventEmitter<void>();
  
  isSpanish: boolean = true;
  isLoading: boolean = false;

  constructor(
    private languageService: LanguageService, 
    private apiService: ApiService 
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && changes['show'].currentValue && this.id) {
      this.loadReserveData();
    }
  }

  loadReserveData() {
    if (!this.id) return;
    this.isLoading = true;
    this.apiService.getReserves().subscribe({
      next: (reserves) => {
        const reserve = reserves.find(r => r.id === this.id);
        if (reserve) {
          this.servicio = reserve.servicio || '';
          this.peluquero = reserve.peluquero || '';
          this.dia = reserve.dia || '';
          this.hora = reserve.hora || '';
          this.precio = reserve.precio || '';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos de la reserva:', error);
        this.isLoading = false;
      }
    });
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  onClose() {
    this.close.emit();
  }
}
