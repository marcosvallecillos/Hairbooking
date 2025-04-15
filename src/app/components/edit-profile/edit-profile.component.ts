import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { LanguageService } from '../../services/language.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule,FooterComponent,ModalLoginComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  userData: Usuario | null = null;
  errors: { [key: string]: string } = {};
  loading = false;
  isSpanish: boolean = true;
  showLoginModal: boolean = false;
  showModal: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  userId: number = 0;

  constructor(
    private languageService: LanguageService,
    private router: Router, 
    private apiService: ApiService,
    private userStateService: UserStateService
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit() {
    // Suscribirse a cambios en el estado del usuario
    this.userStateService.user$.subscribe(user => {
      if (user) {
        this.userData = user;
        this.userId = user.id;
        console.log('Usuario cargado desde el servicio de estado:', this.userData);
        console.log('ID del usuario:', this.userId);
      } else {
        console.log('No hay usuario en el servicio de estado');
        this.router.navigate(['/']);
      }
    });
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  validarFormulario(): boolean {
    this.errors = {};
    
    if (!this.userData) return false;
    
    if (!this.userData.nombre || this.userData.nombre.trim() === '') {
      this.errors['nombre'] = this.getText('El nombre es obligatorio', 'Name is required');
    }
    
    if (!this.userData.apellidos || this.userData.apellidos.trim() === '') {
      this.errors['apellidos'] = this.getText('Los apellidos son obligatorios', 'Last name is required');
    }
    
    if (!this.userData.email || this.userData.email.trim() === '') {
      this.errors['email'] = this.getText('El email es obligatorio', 'Email is required');
    } else if (!this.validarEmail(this.userData.email)) {
      this.errors['email'] = this.getText('El email no es válido', 'Email is not valid');
    }
    
    if (!this.userData.telefono || this.userData.telefono.trim() === '') {
      this.errors['telefono'] = this.getText('El teléfono es obligatorio', 'Phone is required');
    } else if (!this.validarTelefono(this.userData.telefono)) {
      this.errors['telefono'] = this.getText('El teléfono debe tener 9 dígitos', 'Phone must have 9 digits');
    }
    
    return Object.keys(this.errors).length === 0;
  }
  
  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  validarTelefono(telefono: string): boolean {
    const re = /^\d{9}$/;
    return re.test(telefono);
  }

  guardarCambios() {
    if (this.validarFormulario() && this.userData && this.userId > 0) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';
      
      console.log('Enviando datos al servidor:', this.userData);
      console.log('ID del usuario:', this.userId);
      
      // Asegurarse de que el ID esté presente en los datos del usuario
      this.userData.id = this.userId;
      
      // Llamada al API para actualizar el perfil
      this.apiService.editProfile(this.userId, this.userData).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          
          // Actualizar los datos en el servicio de estado
          if (this.userData) {
            this.userStateService.updateUser(this.userData);
          }
          
          // Mostrar mensaje de éxito
          this.successMessage = this.getText('Perfil actualizado con éxito', 'Profile updated successfully');
          
          // Redirigir después de un breve retraso
          setTimeout(() => {
            this.router.navigate(['/showProfile']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al actualizar el perfil:', error);
          
          if (error.status === 405) {
            this.errorMessage = this.getText('Error: Método no permitido. Por favor, contacte al administrador.', 'Error: Method not allowed. Please contact the administrator.');
          } else if (error.status === 404) {
            this.errorMessage = this.getText('Error: Usuario no encontrado.', 'Error: User not found.');
          } else {
            this.errorMessage = this.getText('Error al actualizar el perfil. Por favor, intente de nuevo.', 'Error updating profile. Please try again.');
          }
          
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = this.getText('Error: ID de usuario no válido.', 'Error: Invalid user ID.');
    }
  }

  cancelar() {
    this.router.navigate(['/showProfile']);
  }
}
