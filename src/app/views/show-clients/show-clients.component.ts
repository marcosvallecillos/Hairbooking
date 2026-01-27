import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { Usuario } from '../../models/user.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-show-clients',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterModule,RouterLink],
  templateUrl: './show-clients.component.html',
  styleUrls: ['./show-clients.component.css']
})
export class ShowClientsComponent implements OnInit {
  usuario: Usuario[] = [];
  isSpanish: boolean = true;
  isLoading: boolean = false;
  error: string | null = null;
  reservasPorUsuario: { [usuarioId: number]: number } = {};


  constructor(
    private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  ngOnInit(): void {
    this.getAllClients();

  }

  getAllClients() {
    this.isLoading = true;
    this.error = null;
    this.apiService.getAllUsers().subscribe({
      next: (response) => {
        this.usuario = response; 
        this.isLoading = false;
        this.calcularReservasPorUsuario(); 
        console.log('Clientes:', response);
      },
      error: (error) => {
        this.error = 'Error al obtener los clientes. Por favor, intenta de nuevo.';
        this.isLoading = false;
        console.error('Error al obtener los clientes:', error);
      }
    });
  }

  deleteClient(id: number) {
    this.isLoading = true;
    this.error = null;
    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.getAllClients();
      },
      error: (error) => {
        this.error = 'Error al eliminar el cliente. Por favor, intenta de nuevo.';
        this.isLoading = false;
        console.error('Error al eliminar el cliente:', error);
      }
    });
  }

  private calcularReservasPorUsuario() {
    if (this.usuario.length === 0) {
      this.reservasPorUsuario = {};
      return;
    }

    const conteo: { [usuarioId: number]: number } = {};
    let llamadasCompletadas = 0;
    const totalLlamadas = this.usuario.length;

    this.usuario.forEach((user) => {
      if (user.id != null) {
        this.apiService.getNumeroReservasByUsuarioId(user.id).subscribe({
          next: (respuesta) => {
            conteo[user.id] = respuesta.totalReservas || 0;
            llamadasCompletadas++;
            
            if (llamadasCompletadas === totalLlamadas) {
              this.reservasPorUsuario = conteo;
            }
          },
          error: (error) => {
            console.error(`Error al obtener reservas para usuario ${user.id}:`, error);
            conteo[user.id] = 0;
            llamadasCompletadas++;
            
            if (llamadasCompletadas === totalLlamadas) {
              this.reservasPorUsuario = conteo;
            }
          }
        });
      } else {
        llamadasCompletadas++;
        if (llamadasCompletadas === totalLlamadas) {
          this.reservasPorUsuario = conteo;
        }
      }
    });
  }
  
}