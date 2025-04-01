import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-modal-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-login.component.html',
  styleUrl: './modal-login.component.css'
})
export class ModalLoginComponent {
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  showPassword :boolean =  false;
  email: string = '';
  password: string = '';
  apellidos:string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  loginForm: FormGroup;
  isRegister: boolean = false; // Controla si se muestra la pestaña de registro
  name: string = '';
  isMenuOpen: boolean = false;
  showRegisterModal: boolean = false;

  toggleTab(isRegister: boolean) {
    this.isRegister = isRegister; // Cambia entre las pestañas de inicio de sesión y registro
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
  registrarUsuario() {
    if (this.loginForm.valid) {
      console.log('Usuario registrado:', this.loginForm.value);
      this.closeMenu();
    }
  }
  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
 isSpanish: boolean = true;
  
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }
  constructor(
    private languageService: LanguageService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private apiService: AuthService
  ) {
    this.loginForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value ? null : { passwordsDoNotMatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    console.log('le has dado a enviar')
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }else{
      console.log('datos enviados:', { email: this.email, contraseña:  this.password })
    }

    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      if (this.email === 'email' && this.password === 'password') {
        localStorage.setItem('token', 'token-simulado');
        this.close.emit();
        this.router.navigate(['/reserve']);
      } else {
        this.errorMessage = 'Credenciales inválidas';
      }
      this.isLoading = false;
    }, 1000);
  }

  goToRegister() {
    this.close.emit();
    this.router.navigate(['/sign-up']);
  }

  onClose() {
    this.close.emit();
    this.errorMessage = '';
  }

  openRegisterModal() {
    this.showRegisterModal = true;
    this.show = false;
    
  }

  onRegisterModalClose() {
    this.showRegisterModal = false;
    this.show = true;
  }
}
