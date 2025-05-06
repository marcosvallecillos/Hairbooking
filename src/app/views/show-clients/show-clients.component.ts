import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { Usuario } from '../../models/user.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
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
}