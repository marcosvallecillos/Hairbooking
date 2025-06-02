import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrouselComponent } from '../../components/carrousel/carrousel.component';
import { JumbotronComponent } from '../../components/jumbotron/jumbotron.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ServicesComponent } from '../../components/services/services.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { CosmeticosComponent } from '../../components/cosmeticos/cosmeticos.component';
import { RatingServiceComponent } from '../../components/rating-service/rating-service.component';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CarrouselComponent,
    JumbotronComponent,
    FooterComponent,
    ServicesComponent,
    CosmeticosComponent,
    RatingServiceComponent,
    ChatbotComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
  currentSectionIndex: number = 0;
  sections: string[] = ['section1', 'section2', 'section3', 'section4', 'section5'];

  ngOnInit() {
    this.observeSections();
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

}
