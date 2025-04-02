import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';

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
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();


  onCancel() {
    this.cancel.emit(); 
  
  }
  onConfirm() {
 this.confirm.emit(); 
    }

   isSpanish: boolean = true;
  
    constructor(private languageService: LanguageService) {
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
    }
  
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }
}
