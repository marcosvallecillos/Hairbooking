import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';
import { Valoracion } from '../../models/user.interface';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-rate-service',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './rate-service.component.html',
    styleUrls: ['./rate-service.component.css']
})
export class RateServiceComponent {
    servicioRating: number = 0;
    peluqueroRating: number = 0;
    comentario: string = '';
    formSubmitted: boolean = false;
  valoracion: Valoracion[] = [];
  showAlert: boolean = false; 
  isProcessing: boolean = false;

  @Output() confirm = new EventEmitter<void>();

  isSpanish: boolean = true;
    constructor(private apiService: ApiService, private authService: AuthService,
        private router:Router,
        private languageService: LanguageService) {

  
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
    }
  
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }
    onRatingChange(tipo: 'servicio' | 'peluquero', valor: number): void {
        if (tipo === 'servicio') {
            this.servicioRating = valor;
        } else {
            this.peluqueroRating = valor;
        }
    }

    reiniciarValoraciones(): void {
        this.servicioRating = 0;
        this.peluqueroRating = 0;
        this.comentario = '';
        this.formSubmitted = false;
    }
    valoracionId: number | null = null;

    onSubmit(): void {
        this.isProcessing = true;

        this.formSubmitted = true;

        if (
            this.servicioRating === 0 ||
            this.peluqueroRating === 0 ||
            !this.comentario.trim()
        ) {
            alert('Por favor, completa todos los campos.');
            this.isProcessing = false;

            return;
            
        }

        const userId = this.authService.getUserId();
        if (!userId) {
            alert('No se pudo obtener el ID del usuario. Inicia sesión nuevamente.');
            return;
        }

        const valoracion = {
            id: this.valoracionId!,
            fecha: new Date().toISOString(),
            servicioRating: this.servicioRating,
            peluqueroRating: this.peluqueroRating,
            comentario: this.comentario,
            usuario_id: userId
        };

        console.log('Enviando valoración:', valoracion);

       

        this.apiService.newValoracion(valoracion).subscribe({
            next: (response) => {
                const fecha = response.fecha && typeof response.fecha === 'string'
                    ? new Date(response.fecha)
                    : new Date();
                if (isNaN(fecha.getTime())) {
                    console.warn('Fecha inválida recibida:', response.fecha);
                }
                const valoracionResponse = {
                    ...response,
                    fecha
                };
                console.log('Valoración enviada exitosamente:', valoracionResponse);
                alert('Valoración enviada con éxito');
                this.reiniciarValoraciones();
            },
            error: (error) => {
                console.error('Error al enviar la valoración:', error);
                this.router.navigate(['/show-reserve']);
                this.showAlert = true;
                setTimeout(() => {
                  this.showAlert = false; 
                  this.confirm.emit(); 
                }, 1000);
                setTimeout(() => {
                    window.scrollTo(0, 0);
                  }, 0);
            }
            
        });
    }
}