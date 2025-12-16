import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal-code',
  standalone: true,
  imports: [CommonModule, ClipboardModule],
  templateUrl: './modal-code.component.html',
  styleUrl: './modal-code.component.css'
})
export class ModalCodeComponent implements OnChanges, OnDestroy {

  @Input() codigo = 0;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  isSpanish = true;
  mostrarMensaje = false;

  private destroy$ = new Subject<void>();
  private closeTimeout?: number;

  constructor(
    private languageService: LanguageService,
    private clipboard: Clipboard
  ) {
    this.languageService.isSpanish$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.isSpanish = lang);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']?.currentValue) {
      this.generarCodigoSiEsNecesario();
      this.autoCerrar();
    }
  }

  private generarCodigoSiEsNecesario(): void {
    if (!this.codigo) {
      this.codigo = Math.floor(100000 + Math.random() * 900000);
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

    const copiado = this.clipboard.copy(this.codigo.toString());
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
