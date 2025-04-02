import { Component } from '@angular/core';
import { Usuario } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule,FooterComponent,ModalLoginComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {

  userData: Usuario | null = null;
  errors: { [key: string]: string } = {};
  loading = false;
  isSpanish: boolean = true;

  constructor(private languageService: LanguageService,private router:Router, private apiService:ApiService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  showLoginModal: boolean = false;
  showModal: boolean = false;

  openLoginModal() {
    this.showLoginModal = true;
  }
 validarFormulario(): boolean {
    if (!this.userData) return false;
    
    this.errors = {};
    let isValid = true;

    if (!this.userData.nombre || this.userData.nombre.trim().length < 2) {
      this.errors['nombre'] = 'El nombre es obligatorio y debe tener al menos 2 caracteres';
      isValid = false;
    }

    if (!this.userData.apellidos || this.userData.apellidos.trim().length < 2) {
      this.errors['apellido'] = 'Los apellidos son obligatorios';
      isValid = false;
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!this.userData.telefono || !phoneRegex.test(this.userData.telefono.toString())) {
      this.errors['telefono'] = 'El teléfono debe tener 9 dígitos';
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.userData.email || !emailRegex.test(this.userData.email)) {
      this.errors['email'] = 'Introduce un correo electrónico válido';
      isValid = false;
    }

    if (!isValid) {
      const firstError = Object.values(this.errors)[0];
      alert(firstError);
    }

    return isValid;
  }

  guardarCambios() {
    if (this.validarFormulario() && this.userData) {
      this.loading = true;
      
      // Aquí iría la llamada al API para actualizar el perfil
      // Por ahora solo actualizamos el localStorage
      localStorage.setItem('userData', JSON.stringify(this.userData));
      
      this.loading = false;
      this.router.navigate(['/showProfile']).then(() => {
        window.location.reload();
      });
    }
  }

  cancelar() {
    this.router.navigate(['/showProfile']);
  }
}
