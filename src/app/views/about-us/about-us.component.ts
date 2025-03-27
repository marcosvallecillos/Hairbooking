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
export class AboutUsComponent  {
  equipo = [
    {
      nombre: 'Jesus',
      rol: 'Barbero ',
      rol_en: 'Master',
      imagen: '../../../../images/barber1.jpg',
      descripcion: 'Jesús, el Barbero Principal, es un experto en estilo y precisión. Cada corte refleja su talento y pasión por la barbería. Sus clientes confían en él para lucir siempre impecables.',
      descripcion_en: 'Jesús, the Master Barber, is an expert in style and precision. Each cut reflects his talent and passion for barbering. His clients trust him to always look impeccable.'
   
   
    },
    {
      nombre: 'Miguel',
      rol: 'Colorista',
      rol_en: 'Color Specialist',
      imagen: '../../../../images/colorista.jpg',
      descripcion: 'Miguel, el Color Specialist, domina el arte de transformar cabellos con tonos vibrantes y elegantes. Su precisión y creatividad aseguran resultados impecables. Cada cliente sale con un color perfecto y lleno de vida.',
      descripcion_en: 'Miguel, the Color Specialist, masters the art of transforming hair with vibrant and elegant tones. His precision and creativity ensure flawless results. Every client leaves with a perfect, vibrant color.'
   
    },
    {
      nombre: 'Leo',
      rol:'Ayudante',
      rol_en: 'Assistant',
      imagen: '../../../../images/barber2.jpg',
      descripcion: 'Leo, el Ayudante, es clave para que todo funcione a la perfección. Su energía y compromiso hacen cada servicio más eficiente. Siempre está listo para apoyar con una sonrisa.',
      descripcion_en: 'Leo, the Assistant, is key to making everything run smoothly. His energy and commitment make each service more efficient. He is always ready to support with a smile.'
    }
  ];

  miembrosExpandido: boolean[] = Array(this.equipo.length).fill(false);

  toggleContent(index: number) {
    this.miembrosExpandido[index] = !this.miembrosExpandido[index];
  }

  isSpanish: boolean = true;
  isTextExpanded: boolean = false;
  isContentVisible: boolean = false;

  constructor(private languageService: LanguageService, private route: ActivatedRoute) {
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


}
