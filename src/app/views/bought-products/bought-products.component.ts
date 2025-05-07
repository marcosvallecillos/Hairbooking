import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageService } from '../../services/language.service';
import { Compra } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';

@Component({
  selector: 'app-bought-products',
  imports: [CommonModule, FooterComponent,ModalUserComponent],
  templateUrl: './bought-products.component.html',
  styleUrl: './bought-products.component.css'
})
export class BoughtProductsComponent {
isLoading: boolean = false;
error: string | null = null;
compras: Compra[] = [];
selectedUserId: number | null = null;
showLoginModal: boolean = false;
  isSpanish: boolean = true; // Cambia esto según el idioma actual

  constructor(private languageService: LanguageService, private apiService: ApiService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );

  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  ngOnInit(): void {
    this.getAllCompras();
  }
  getAllCompras() {
    this.isLoading = true;
    this.apiService.getCompras().subscribe({
      next: (response) => {
        this.compras = response.sort((a, b) => {
          if (a.usuario && b.usuario) {
            return a.usuario.id - b.usuario.id;
          }
          return 0;
        });
        this.isLoading = false;
        console.log('Compras ordenadas:', this.compras);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al obtener compras:', error);
      }
    });
  }

calcularDescuento(total: number): number {
  if (total > 500) {
    return total * 0.05;
  }
  return 0;
}

openUserModal(usuarioId: number) {
  this.selectedUserId = usuarioId;
  this.showLoginModal = true;
}
deleteBuy(id: number) {
  this.isLoading = true;
  this.error = null;

  this.apiService.deletePurchase(id).subscribe({
    next: () => {
      this.getAllCompras(); 
      
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    },
    error: (error) => {
      this.error = 'Error al eliminar el cliente. Por favor, intenta de nuevo.';
      this.isLoading = false;
      console.error('Error al eliminar el cliente:', error);
    }
    
  });
  
}

}
