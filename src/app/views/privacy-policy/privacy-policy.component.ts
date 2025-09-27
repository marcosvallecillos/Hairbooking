import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css',
  imports: [RouterLink],
})
export class PrivacyPolicyComponent {
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



