import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  showPassword = false;
  signUpForm: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    },
    { validators: this.passwordsMatchValidator }
  );

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  registrarUsuario(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const usuario = { ...this.signUpForm.value };
    delete usuario.confirmPassword;

    console.log('Registrando usuario:', usuario);

    this.apiService.registerUser(usuario).subscribe({
      next: (response) => {
        console.log('Usuario registrado:', response);
        this.authService.login(response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        alert(`Error en el registro: ${error.error?.message || 'Verifica los datos e intenta de nuevo'}`);
      },
    });
  }

  getControl(controlName: string) {
    return this.signUpForm.get(controlName);
  }
  onSignUp() {
    if (this.signUpForm.valid) {
      // Redirigir a home y activar el modal de login
      this.router.navigate(['/'], {
        queryParams: { showLogin: 'true' }
      });
    }
  }
  goToLogin() {
    this.router.navigate(['/']);
  }
}
