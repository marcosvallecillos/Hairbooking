import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
 
  @Input() show: boolean = false;
  @Input() fecha: string | null = '';
  @Input() hora: string = '';
  @Input() servicio: string = '';
  @Input() service: string = '';
  @Input() peluquero: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  showAlert: boolean = false; 
  showAlertCancel: boolean = false;
  onConfirm() {
    this.show = false;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false; 
      this.confirm.emit(); 
    }, 1000);

    
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
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
