import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { CarrouselComponent } from '../../components/carrousel/carrousel.component';
import { JumbotronComponent } from '../../components/jumbotron/jumbotron.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ServicesComponent } from '../../components/services/services.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { HeaderUserComponent } from '../../components/header-user/header-user.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent, 
    HeaderUserComponent,
    CarrouselComponent,
    JumbotronComponent,
    FooterComponent,
    ServicesComponent,
    GalleryComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentSectionIndex: number = 0;
  sections: string[] = ['section1', 'section2', 'section3', 'section4', 'section5'];

  ngOnInit() {
    this.observeSections();
  }

  ngAfterViewInit() {
    this.initWheelControl();
  }

  isCurrentSection(sectionId: string): boolean {
    return this.sections[this.currentSectionIndex] === sectionId;
  }

  scrollToSection(index: number) {
    const element = document.getElementById(this.sections[index]);
    if (element) {
      element.scrollIntoView({  behavior: 'smooth' });
      this.currentSectionIndex = index;
    }
  }

  private observeSections() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = this.sections.indexOf(sectionId);
          if (index !== -1) {
            this.currentSectionIndex = index;
            entry.target.classList.add('visible');
          }
        }
      });
    }, { threshold: 0.5 });

    this.sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });
  }

  private initWheelControl() {
    let isScrolling = false;

    document.addEventListener('wheel', (e) => {
      if (isScrolling) return;
      isScrolling = true;

      if (e.deltaY > 0 && this.currentSectionIndex < this.sections.length - 1) {
        this.scrollToSection(this.currentSectionIndex + 1);
      } else if (e.deltaY < 0 && this.currentSectionIndex > 0) {
        this.scrollToSection(this.currentSectionIndex - 1);
      }

      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }, { passive: true });
  }
}
