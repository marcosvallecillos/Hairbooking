import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-policy-cookies',
  imports: [RouterLink],
  templateUrl: './policy-cookies.component.html',
  styleUrl: './policy-cookies.component.css',
})
export class PolicyCookiesComponent {
   
     isSpanish: boolean = true;
      
        constructor(private languageService: LanguageService) {
          this.languageService.isSpanish$.subscribe(
            isSpanish => this.isSpanish = isSpanish
          );
        }
      
        getText(es: string, en: string): string {
          return this.isSpanish ? es : en;
        }
   
}



