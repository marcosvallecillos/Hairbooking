import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

@Component({
  selector: 'app-cookie-consent',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.css'
})
export class CookieConsentComponent implements OnInit {
  isVisible:boolean = false;
  isCustomizing:boolean = false;

  preferences: Omit<CookiePreferences, 'timestamp'> = {
    necessary: true,
    analytics: false,
    marketing: false,
  };

  ngOnInit(): void {
    const saved = this.getSavedPreferences();
    if (!saved) {
      this.isVisible = true;
    }
  }

  isSpanish: boolean = true;
  
    constructor(private languageService: LanguageService) {
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
    }
  
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }

  acceptAll(): void {
    const all: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(all));
    this.isVisible = false;
  }

  rejectAll(): void {
    const none: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(none));
    this.isVisible = false;
  }

  openCustomize(): void {
    const saved = this.getSavedPreferences();
    if (saved) {
      this.preferences = {
        necessary: true,
        analytics: saved.analytics,
        marketing: saved.marketing,
      };
    }
    this.isCustomizing = true;
  }

  saveCustom(): void {
   const custom: CookiePreferences = {
  ...this.preferences, // Copia 'necessary', 'analytics', 'marketing'
  necessary: true,     // Sobrescribe la propiedad 'necessary'
  timestamp: new Date().toISOString(), // Añade/sobrescribe 'timestamp'
};

    localStorage.setItem('cookieConsent', JSON.stringify(custom));
    this.isVisible = false;
    this.isCustomizing = false;
  }

  goBack(): void {
    this.isCustomizing = false;
  }

  openFromFab(): void {
    this.isVisible = true;
    this.isCustomizing = true;
  }

  private getSavedPreferences(): CookiePreferences | null {
    try {
      const raw = localStorage.getItem('cookieConsent');
      if (!raw) return null;
      return JSON.parse(raw) as CookiePreferences;
    } catch {
      return null;
    }
  }
}
