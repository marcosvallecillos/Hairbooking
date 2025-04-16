import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { Usuario } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { UserStateService } from '../../services/user-state.service';

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

  loginForm: FormGroup;
  isRegister: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';
  goodMessage:string = '';
  isLoading: boolean = false;
  isSpanish: boolean = true;
  rememberMe: boolean = false;

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private userStateService: UserStateService
  ) {
    this.loginForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    this.languageService.isSpanish$.subscribe(isSpanish => {
      this.isSpanish = isSpanish;
    });

    // Reset form validators for login
    this.toggleFormValidators();
  }

  toggleFormValidators() {
    if (this.isRegister) {
      this.loginForm.get('nombre')?.setValidators([Validators.required, Validators.minLength(2)]);
      this.loginForm.get('apellidos')?.setValidators([Validators.required, Validators.minLength(2)]);
      this.loginForm.get('telefono')?.setValidators([Validators.required, Validators.pattern(/^\d{9}$/)]);
      this.loginForm.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
      ]);
      this.loginForm.get('confirmPassword')?.setValidators([Validators.required]);
    } else {
      this.loginForm.get('nombre')?.clearValidators();
      this.loginForm.get('apellidos')?.clearValidators();
      this.loginForm.get('telefono')?.clearValidators();
      this.loginForm.get('password')?.setValidators([Validators.required]);
      this.loginForm.get('confirmPassword')?.clearValidators();
      this.loginForm.clearValidators();
    }
    this.loginForm.get('nombre')?.updateValueAndValidity();
    this.loginForm.get('apellidos')?.updateValueAndValidity();
    this.loginForm.get('telefono')?.updateValueAndValidity();
    this.loginForm.get('password')?.updateValueAndValidity();
    this.loginForm.get('confirmPassword')?.updateValueAndValidity();
  }

  passwordMatchValidator() {
    return (form: FormGroup): ValidationErrors | null => {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      return password && confirmPassword && password !== confirmPassword ? { passwordsDoNotMatch: true } : null;
    };
  }

  toggleTab(isRegister: boolean) {
    this.isRegister = isRegister;
    this.errorMessage = '';
    this.loginForm.reset();
    this.toggleFormValidators();
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = this.getText('Por favor, completa todos los campos correctamente', 'Please fill all fields correctly');
      this.loginForm.markAllAsTouched();
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
  
    const { email, password } = this.loginForm.value;
    this.apiService.loginUser(email, password).subscribe({
      next: (usuario: any) => {
        if (usuario.status === 'ok') {
          const userData: Usuario = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            telefono: usuario.telefono,
            password: '',
            citas_reservadas: []
          };
          
          // Actualizar el estado del usuario
          this.userStateService.updateUser(userData);
          
          this.close.emit();
          this.router.navigate(['/home-barber']);
        } else {
          this.errorMessage = this.getText('Credenciales inválidas', 'Invalid credentials');
        }
  
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = this.getText(
          error.error?.message || 'Error de servidor',
          error.error?.message || 'Server error'
        );
        this.isLoading = false;
      }
    });
  }
  
  registrarUsuario() {
    if (this.loginForm.invalid || this.loginForm.hasError('passwordsDoNotMatch')) {
      this.errorMessage = this.getText(
        'Por favor, completa todos los campos correctamente y verifica que las contraseñas coincidan',
        'Please fill all fields correctly and ensure passwords match'
      );
      this.loginForm.markAllAsTouched();
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
    this.goodMessage = '';
    const usuario: Usuario = {
      id: 0,
      nombre: this.loginForm.get('nombre')?.value,
      apellidos: this.loginForm.get('apellidos')?.value,
      email: this.loginForm.get('email')?.value,
      telefono: this.loginForm.get('telefono')?.value,
      password: this.loginForm.get('password')?.value,
      citas_reservadas: []
    };
  
    console.log('Usuario a registrar:', usuario);
  
    this.apiService.registerUser(usuario).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Respuesta del backend:', response);
        
        this.goodMessage = this.getText(
          'Registro exitoso, ahora puedes iniciar sesión',
          'Registration successful, you can now log in'
        );
        
        // Cambiar a la pestaña de login y limpiar el formulario
        this.isRegister = false;
        this.loginForm.reset();
        this.toggleFormValidators();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al registrar:', error);
        if (error.status === 400) {
          const errorMsg = error.error?.error || 'Error en los datos proporcionados';
          this.errorMessage = this.getText(
            errorMsg,
            errorMsg.includes('email ya está registrado') ? 'Email already registered' : 'Error in the provided data'
          );
        } else if (error.status === 500) {
          this.errorMessage = this.getText(
            'Error en el servidor, intenta de nuevo más tarde',
            'Server error, please try again later'
          );
        } else {
          this.errorMessage = this.getText(
            'Error desconocido, intenta de nuevo',
            'Unknown error, please try again'
          );
        }
      }
    });
  }

  onClose() {
    this.close.emit();
    this.errorMessage = '';
    this.loginForm.reset();
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
}