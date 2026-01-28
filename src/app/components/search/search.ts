import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search implements OnInit, OnDestroy {
  @Output() searchText = new EventEmitter<string>();
  
  searchInput: string = '';
  private searchSubject = new Subject<string>();
  isSpanish: boolean = true;

  constructor(private languageService: LanguageService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
    
    // Configurar emisión de texto con debounce
    this.searchSubject.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deje de escribir
      distinctUntilChanged() // Solo emitir si el valor cambió
    ).subscribe({
      next: (text) => {
        this.searchText.emit(text);
      }
    });
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  ngOnInit(): void {
    // Emitir string vacío inicialmente para mostrar todos los clientes
    this.searchText.emit('');
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput = value;
    this.searchSubject.next(value.trim());
  }

  clearSearch(): void {
    this.searchInput = '';
    this.searchSubject.next('');
  }
}
