import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { Usuario } from '../../models/user.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Search } from '../../components/search/search';

@Component({
  selector: 'app-show-clients',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterModule,RouterLink,Search],
  templateUrl: './show-clients.component.html',
  styleUrls: ['./show-clients.component.css']
})
export class ShowClientsComponent implements OnInit {
  usuario: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  isSpanish: boolean = true;
  isLoading: boolean = false;
  error: string | null = null;
  reservasPorUsuario: { [usuarioId: number]: number } = {};
  searchText: string = '';


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
        this.filteredUsuarios = [...response]; // Inicializar con todos los clientes
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
        // Eliminar de ambos arrays
        this.usuario = this.usuario.filter(u => u.id !== id);
        this.filteredUsuarios = this.filteredUsuarios.filter(u => u.id !== id);
        delete this.reservasPorUsuario[id];
        this.isLoading = false;
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

  onSearchTextChange(text: string): void {
    this.searchText = text;
    
    if (!text || !text.trim()) {
      // Si no hay texto, mostrar todos los clientes
      this.filteredUsuarios = [...this.usuario];
      return;
    }

    // Búsqueda local con autocompletado (coincidencias parciales)
    const searchTerm = text.trim().toLowerCase();
    
    this.filteredUsuarios = this.usuario.filter(user => {
      const nombre = (user.nombre || '').toLowerCase();
      const apellidos = (user.apellidos || '').toLowerCase();
      const nombreCompleto = `${nombre} ${apellidos}`.trim();
      
      return nombreCompleto.includes(searchTerm) ||
            nombre.startsWith(searchTerm) ||
            apellidos.startsWith(searchTerm) ||
            nombre.includes(searchTerm) ||
            apellidos.includes(searchTerm);
    });
    
    // Calcular reservas para los usuarios filtrados si no las tienen
    this.calcularReservasPorUsuarioFiltered();
  }

  private calcularReservasPorUsuarioFiltered(): void {
    if (this.filteredUsuarios.length === 0) {
      return;
    }

    this.filteredUsuarios.forEach((user) => {
      if (user.id != null && !this.reservasPorUsuario[user.id]) {
        this.apiService.getNumeroReservasByUsuarioId(user.id).subscribe({
          next: (respuesta) => {
            this.reservasPorUsuario[user.id] = respuesta.totalReservas || 0;
          },
          error: (error) => {
            console.error(`Error al obtener reservas para usuario ${user.id}:`, error);
            this.reservasPorUsuario[user.id] = 0;
          }
        });
      }
    });
  }
}