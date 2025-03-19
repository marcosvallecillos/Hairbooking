import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, HeaderComponent,FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  
  ngOnInit() {
    // Inicializar el observador de scroll
    this.initScrollAnimation();
  }

  ngAfterViewInit() {
    // Aplicar las animaciones iniciales
    this.checkScroll();
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
