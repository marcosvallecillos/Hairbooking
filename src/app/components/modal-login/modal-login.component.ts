import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalRegisterComponent } from '../modal-register/modal-register.component';

@Component({
  selector: 'app-modal-login',
  standalone: true,
  imports: [CommonModule, FormsModule,ModalRegisterComponent],
  templateUrl: './modal-login.component.html',
  styleUrl: './modal-login.component.css'
})
export class ModalLoginComponent {
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  showPassword = false;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  loginForm: FormGroup;
  
 isMenuOpen: boolean = false;
  showRegisterModal: boolean = false;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private apiService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      if (this.email === 'test@example.com' && this.password === 'password') {
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
  }
}
