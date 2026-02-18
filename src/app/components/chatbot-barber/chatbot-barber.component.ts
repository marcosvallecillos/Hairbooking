import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
}
@Component({
  selector: 'app-chatbot-barber',
  imports: [FormsModule,NgClass],
  templateUrl: './chatbot-barber.component.html',
  styleUrl: './chatbot-barber.component.css'
})
export class ChatbotBarberComponent {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  isLoading = false;
  userInput = '';
  messages: Message[] = [];
  isSpanish = true;
  private langSub!: Subscription;

  private CHAT_URL = 'http://localhost:8001/chat';

  constructor(
    private http: HttpClient,
    private languageService: LanguageService,
    private authService: AuthService 
  ) {}

  ngOnInit() {
    this.langSub = this.languageService.isSpanish$.subscribe(val => {
      this.isSpanish = val;
      if (this.messages.length > 0) {
        this.messages = [];
        this.addWelcomeMessage();
      }
    });

    this.addWelcomeMessage();
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
  }

  addWelcomeMessage() {
    this.messages = [{
      role: 'assistant',
      content: this.isSpanish
        ? '👋 ¡Hola! Soy el asistente de HairBooking. ¿En qué puedo ayudarte?'
        : '👋 Hi! I\'m the HairBooking assistant. How can I help you?'
    }];
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) setTimeout(() => this.scrollToBottom(), 100);
  }

  async sendMessage() {
    const text = this.userInput.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ role: 'user', content: text });
    this.userInput = '';
    this.isLoading = true;
    this.scrollToBottom();

    // 👇 Usa AuthService para obtener el usuario actual
    const usuario = this.authService.getUserData();

    const historial = this.messages
      .filter(m => !(m.role === 'assistant' && m.content.includes('👋')))
      .map(m => ({ role: m.role, content: m.content }));

    const body = {
      messages: historial,
      language: this.isSpanish ? 'es' : 'en',
      usuario: usuario  // null si no está logueado, objeto si sí
    };

    this.http.post<{ response: string }>(this.CHAT_URL, body).subscribe({
      next: (res) => {
        this.messages.push({ role: 'assistant', content: res.response });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: this.isSpanish
            ? '❌ Error al conectar con el asistente. Inténtalo de nuevo.'
            : '❌ Error connecting to the assistant. Please try again.'
        });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }
}