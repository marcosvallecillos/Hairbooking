import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../services/api-service.service';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-user',
  imports: [],
  templateUrl: './modal-user.component.html',
  styleUrl: './modal-user.component.css'
})
export class ModalUserComponent {
  @Input() show: boolean = false;
  @Input() id: number | null = null;
  @Input() nombre: string | null = '';
  @Input() apellidos: string | null = '';
  @Input() email: string | null = '';
  @Input() telefono: string | null = '';
  @Input() rol: string | null = '';
  @Output() close = new EventEmitter<void>();
  isSpanish: boolean = true;
  constructor(
    private languageService: LanguageService,
     private router: Router, 
    private apiService: ApiService 
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  onClose() {
    this.close.emit();
    console.log('Modal closed');
  }

}
