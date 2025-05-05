import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';
import { Valoracion, Reserva } from '../../models/user.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-rate-service',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './rate-service.component.html',
    styleUrls: ['./rate-service.component.css']
})
export class RateServiceComponent implements OnInit {
    servicioRating: number = 0;
    peluqueroRating: number = 0;
    comentario: string = '';
    formSubmitted: boolean = false;
    valoracion: Valoracion[] = [];
    showAlert: boolean = false;
    isProcessing: boolean = false;
    isSpanish: boolean = true;
    reservaValidada: boolean = false;
    yaValorada: boolean = false;
    
    @Output() confirm = new EventEmitter<void>();
    reserve: Reserva | null = null;

    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private languageService: LanguageService
    ) {
        this.languageService.isSpanish$.subscribe(
            isSpanish => this.isSpanish = isSpanish
        );
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const reserveId = params['id'];
            if (reserveId) {
                this.apiService.getReserveById(reserveId).subscribe({
                    next: (reserve) => {
                        this.reserve = reserve;
                        this.yaValorada = !!reserve.valoracion;
                    },
                    error: (error) => {
                        console.error('Error al obtener la reserva:', error);
                        this.router.navigate(['/show-reserve']);
                    }
                });
            }
        });
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

    onSubmit(): void {
        this.isProcessing = true;
        this.formSubmitted = true;
        this.showAlert = true;
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
            this.isProcessing = false;
            return;
        }
    
        if (!this.reserve) {
            alert('No se pudo obtener la reserva seleccionada. Por favor, inténtalo de nuevo.');
            this.isProcessing = false;
            return;
        }
    
        const valoracion = {
            servicioRating: this.servicioRating,
            peluqueroRating: this.peluqueroRating,
            comentario: this.comentario,
            usuario_id: userId,
            reserva_id: this.reserve.id
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
                this.reiniciarValoraciones();
                this.router.navigate(['/show-reserve']);
                this.showAlert = true;
                setTimeout(() => {
                    this.showAlert = false;
                    this.confirm.emit();
                }, 3000);
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 0);
            },
            error: (error) => {
                console.error('Error al enviar la valoración:', error);
                alert('Error al enviar la valoración. Por favor, inténtalo de nuevo más tarde.');
                this.isProcessing = false;
            }
        });
    }
}