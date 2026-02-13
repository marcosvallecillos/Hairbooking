  import { ChangeDetectorRef, Component } from '@angular/core';
  import { RouterLink } from '@angular/router';
  import { FooterComponent } from '../../components/footer/footer.component';
  import { LanguageService } from '../../services/language.service';
  import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
  @Component({
  selector: 'app-index',
  imports: [RouterLink],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  isSpanish: boolean = true;
  codigoDisplay:string = '';
  show:boolean = false;
  baseUrl!: string;
  isFavorite: boolean = false;
  isFavoriteProduct: boolean = false;

ngOnInit() {
  this.baseUrl = window.location.origin;
}
  constructor(
    private languageService: LanguageService,
    private clipboard: Clipboard,
    private cdr: ChangeDetectorRef
  ) {
    this.languageService.isSpanish$
      .subscribe(lang => this.isSpanish = lang);
  }
  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }
  iscopy:boolean = false;

  copiarUrl(path: string, event?: Event) {
    event?.stopPropagation();
    const url = window.location.origin + path;
    this.clipboard.copy(url);
    this.iscopy = true;
    console.log("copiado",this.iscopy)
    setTimeout(() => {
      this.iscopy = false;  
    }, 3000); 
   }
  
   toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  
    if (this.isFavorite) {
      localStorage.setItem('barberia_fav', 'true');
    } else {
      localStorage.removeItem('barberia_fav');
    }
  }
  toggleFavoriteProducts() {
    this.isFavoriteProduct = !this.isFavoriteProduct;
  
    if (this.isFavoriteProduct) {
      localStorage.setItem('barberia_fav', 'true');
    } else {
      localStorage.removeItem('barberia_fav');
    }
  }
 
}
