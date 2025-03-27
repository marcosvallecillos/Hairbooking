import { NgClass, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { ModalLoginComponent } from '../modal-login/modal-login.component';

@Component({
  selector: 'app-modal-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-register.component.html',
  styleUrl: './modal-register.component.css'
})
export class ModalRegisterComponent {
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  errorMessage: string = '';
  signUpForm: FormGroup;
  showPassword = false;
  isMenuOpen: boolean = false;

  showLoginModal: boolean = false;
  constructor(private fb: FormBuilder,  private languageService: LanguageService,) {
    this.signUpForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  openLoginModal() {
    this.showLoginModal = true;
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  getControl(controlName: string) {
    return this.signUpForm.get(controlName);
  }

  onClose() {
    this.close.emit();
    this.errorMessage = '';
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value ? null : { passwordsDoNotMatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  registrarUsuario() {
    if (this.signUpForm.valid) {
      console.log('Usuario registrado:', this.signUpForm.value);
      this.closeMenu();
    }
  }
  isSpanish: boolean = true;
  
  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  
  closeLoginModal() {
    this.showLoginModal = false;
  }
}