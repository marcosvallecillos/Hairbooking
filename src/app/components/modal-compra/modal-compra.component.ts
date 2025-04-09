import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-modal-compra',
  imports: [],
  templateUrl: './modal-compra.component.html',
  styleUrl: './modal-compra.component.css'
})
export class ModalCompraComponent {

  @Input() show: boolean = false;
  @Input() producto: string | null = '';
  @Input() precio: number  | string = ' ';
  @Input() descuento:string = '';
  @Input() cantidad: string = '';
  @Input() total: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  showAlert: boolean = false; 
  showAlertCancel: boolean = false;
  
ngOnChanges() {
  this.precio = parseFloat(this.precio as string).toFixed(2); 
}
  
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
 this.show = false;
    this.showAlertCancel = true;
    setTimeout(() => {
      this.showAlertCancel = false; 
      this.cancel.emit(); 
    }, 1000);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  
  }
  onClose() {
    this.close.emit();
    console.log('le estas dando');
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
