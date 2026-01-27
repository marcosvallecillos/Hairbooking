import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-modal-deleteall',
  imports: [],
  templateUrl: './modal-deleteall.component.html',
  styleUrl: './modal-deleteall.component.css'
})
export class ModalDeleteallComponent {
  @Input() show: boolean = false;
  isProcessing: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  constructor(private languageService: LanguageService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }
  onCancel() {
    this.cancel.emit();
    this.isProcessing = false;
  }

  isSpanish: boolean = true;

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  onConfirm() {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
    }, 2000);
    this.confirm.emit();
  }
}
