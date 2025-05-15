import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageService } from '../../services/language.service';
import { Compra, FilterDateResponse } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bought-products',
  imports: [CommonModule, FooterComponent,ModalUserComponent, FormsModule],
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
  selectedDate: string | null = null;
  today: string = new Date().toISOString().split('T')[0];

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
        console.log('Respuesta del backend (todas las compras):', response);
        this.compras = response.map(compra => ({
          ...compra,
          total: compra.precio || compra.total
        })).sort((a, b) => {
          if (a.usuario && b.usuario) {
            return a.usuario.id - b.usuario.id;
          }
          return 0;
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al obtener compras:', error);
      }
    });
  }

calcularDescuento(total: number): number {
  if (!total) {
    console.warn('Total is undefined or null');
    return 0;
  }
  // Use total if precio is undefined
  const precioTotal = total;
  if (precioTotal > 500) {
    return precioTotal * 0.05;
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

filterByDate() {
  if (!this.selectedDate) {
    this.getAllCompras();
    return;
  }

  this.isLoading = true;
  const date = new Date(this.selectedDate);
  console.log('Selected date:', this.selectedDate);
  console.log('Date object:', date);
  
  this.apiService.filterByDate(date).subscribe({
    next: (response: FilterDateResponse) => {
      console.log('Filter response:', response);
      if (response.status === 'success' && response.compras) {
        this.compras = response.compras.map(compra => ({
          ...compra,
          total: compra.precio || compra.total
        })).sort((a: Compra, b: Compra) => {
          if (a.usuario && b.usuario) {
            return a.usuario.id - b.usuario.id;
          }
          return 0;
        });
      } else {
        this.compras = [];
      }
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Filter error details:', error);
      this.isLoading = false;
      this.error = this.getText(
        'Error al filtrar por fecha. Por favor, intente de nuevo.',
        'Error filtering by date. Please try again.'
      );
    }
  });
}

clearDateFilter() {
  this.selectedDate = null;
  this.getAllCompras();
}

}
