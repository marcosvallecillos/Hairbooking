import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageService } from '../../services/language.service';
import { RouterLink } from '@angular/router';
import {  Usuario, Valoracion } from '../../models/user.interface';
import { ApiService } from '../../services/api-service.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-list-price',
  imports: [FooterComponent, RouterLink,NgClass],
  templateUrl: './list-price.component.html',
  styleUrl: './list-price.component.css'
})
export class ListPriceComponent {
  isSpanish = true;
 

  constructor(private languageService: LanguageService, private apiService: ApiService) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }
  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
  

}