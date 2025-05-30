import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Reserva } from '../../models/user.interface';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.css'
})
export class ModalDeleteComponent {
   @Input() show: boolean = false;
  @Input() fecha: string | null = '';
  @Input() hora: string = '';
  @Input() servicio: string = '';
  @Input() peluquero: string = '';
  @Input() usuario: number | null = null;
  isAdmin: boolean = false;
  isProcessing: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private languageService: LanguageService, private userStateService: UserStateService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit() {
    this.isAdmin = this.userStateService.getIsAdmin();
  }

  onCancel() {
    this.cancel.emit();
    this.isProcessing = false;
  }

  onConfirm() {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
    }, 2000);
    this.confirm.emit();
  }

  isSpanish: boolean = true;

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  isReservePast(reserve: Reserva): boolean {
    const [year, month, day] = reserve.dia.split('-').map(Number);
    const [hours, minutes] = reserve.hora.split(':').map(Number);
    
    const reserveDate = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    
    return reserveDate < now;
  }
}
