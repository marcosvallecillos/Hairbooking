import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from '../../services/api-service.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FooterComponent, NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  contactForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      privacy: [false, [Validators.requiredTrue]]
    });
  }

  sendContactForm() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.apiService.sendContactForm(this.contactForm.value).pipe(
        catchError(error => {
          console.error('Error sending contact form:', error);
          this.errorMessage = 'Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
          this.isSubmitting = false;
          return of(null);
        })
      ).subscribe({
        next: (response: any) => {
          if (response) {
            this.successMessage = '¡Tu mensaje ha sido enviado correctamente!';
            this.contactForm.reset();
            Object.keys(this.contactForm.controls).forEach(key => {
              const control = this.contactForm.get(key);
              control?.setErrors(null);
            });
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error in subscription:', error);
          this.errorMessage = 'Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
          this.isSubmitting = false;
        }
      });
    } else if (!this.contactForm.valid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
