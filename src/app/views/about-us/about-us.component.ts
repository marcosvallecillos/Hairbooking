import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  equipo = [
    {
      nombre: 'Jesus',
      rol: 'Master Barber',
      imagen: '../../../../images/barber1.jpg',
      descripcion: 'Este es el contenido adicional sobre Jesús. Puedes incluir cualquier información relevante aquí.'
    },
    {
      nombre: 'Miguel',
      rol: 'Color Specialist',
      imagen: '../../../../images/barber2.jpg',
      descripcion: 'Este es el contenido adicional sobre Miguel. Puedes incluir cualquier información relevante aquí.'
    },
    {
      nombre: 'Carlos',
      rol: 'Color Specialist',
      imagen: '../../../../images/barber2.jpg',
      descripcion: 'Este es el contenido adicional sobre Carlos. Puedes incluir cualquier información relevante aquí.'
    }
  ];

  miembrosExpandido: boolean[] = Array(this.equipo.length).fill(false);

  toggleContent(index: number) {
    this.miembrosExpandido[index] = !this.miembrosExpandido[index];
  }

  isSpanish: boolean = true;
  isTextExpanded: boolean = false;
  isContentVisible: boolean = false; // Control del contenido visible

  constructor(private languageService: LanguageService, private route: ActivatedRoute) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit() {
    // Inicializar el observador de scroll
    this.initScrollAnimation();
  }

  ngAfterViewInit() {
    // Aplicar las animaciones iniciales
    this.checkScroll();
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  // Función para alternar la visibilidad del contenido
  toggleContentVisibility() {
    this.isContentVisible = !this.isContentVisible;
  }

  toggleText() {
    this.isTextExpanded = !this.isTextExpanded;
  }

  getToggleButtonText(): string {
    return this.isTextExpanded ? 
      this.getText('Ver menos', 'See less') : 
      this.getText('Ver más', 'See more');
  }

  private initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    // Observar todos los elementos con la clase fade-in
    document.querySelectorAll('.fade-in').forEach((element) => {
      observer.observe(element);
    });
  }

  private checkScroll() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight) {
        element.classList.add('visible');
      }
    });
  }
}
