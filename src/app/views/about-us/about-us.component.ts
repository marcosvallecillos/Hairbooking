import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  
  isSpanish: boolean = true;
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
