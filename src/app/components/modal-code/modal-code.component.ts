import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../models/user.interface';

@Component({
  selector: 'app-modal-code',
  standalone: true,
  imports: [CommonModule, ClipboardModule,],
  templateUrl: './modal-code.component.html',
  styleUrl: './modal-code.component.css'
})
export class ModalCodeComponent implements OnChanges, OnDestroy {

  @Input() codigo: string =  '';
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  usuario: Usuario | null = null;

  isSpanish = true;
  mostrarMensaje = false;
  
  get codigoDisplay(): string {
    return this.codigo || '';
  }

  private destroy$ = new Subject<void>();
  private closeTimeout?: number;

  constructor(
    private languageService: LanguageService,
    private clipboard: Clipboard,
    private cdr: ChangeDetectorRef
  ) {
    this.languageService.isSpanish$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.isSpanish = lang);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']?.currentValue) {
      console.log('Modal abierto, código actual:', this.codigo);
      this.autoCerrar();
      // Si el modal se abre y hay código, forzar detección de cambios
      if (this.codigo) {
        this.cdr.detectChanges();
      }
    }
    if (changes['codigo']) {
      console.log('Código recibido en modal:', this.codigo);
      console.log('Cambio en codigo - anterior:', changes['codigo'].previousValue, 'actual:', changes['codigo'].currentValue);
      // Forzar detección de cambios para asegurar que se muestre el código
      this.cdr.detectChanges();
    }
    // Si el modal se abre y no hay código, intentar obtenerlo
    if (changes['show']?.currentValue && !this.codigo) {
      this.generarCodigoSiEsNecesario();
    }
  }

  private generarCodigoSiEsNecesario(): void {
    if (!this.codigo) {
      this.codigo = this.usuario?.codigoCorteGratis || '';
      console.log('Codigo generado:', this.codigo);
    }
  }

  private autoCerrar(): void {
    clearTimeout(this.closeTimeout);
    this.closeTimeout = window.setTimeout(() => {
      this.close.emit();
    }, 10000);
  }

  copiarTexto(event?: Event): void {
    event?.stopPropagation();

    const codigoACopiar = this.codigoDisplay || this.codigo || '';
    const copiado = this.clipboard.copy(codigoACopiar);
    if (copiado) {
      this.mostrarMensaje = true;
      setTimeout(() => this.show = false, 2000);
    }
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  onClose(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.closeTimeout);
  }
}
