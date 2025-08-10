import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit {
  messages: ChatMessage[] = [];
  userInput: string = '';
  isOpen: boolean = false;
  isLoading: boolean = false;
 
   isSpanish: boolean = true;
    
      constructor(private languageService: LanguageService) {
        this.languageService.isSpanish$.subscribe(
          isSpanish => this.isSpanish = isSpanish
        );
      }
    
      getText(es: string, en: string): string {
        return this.isSpanish ? es : en;
      }
 private readonly respuestas = {
    'hola': this.getText(
        '¡Hola! Soy el asistente virtual de Hairbooking. ¿En qué puedo ayudarte hoy?',
        'Hello! I´m Hairbooking´s virtual assistant. How can I help you today?'
    ),
    'precios': this.getText(
        'Aquí tienes nuestros precios:\n- Mascarilla Puntos Negros – 10 €\n- Arreglo Barba – 10 €\n- Corte Degradado – 12 €\n- Degradado + Barba – 15 €\n- Corte + Cejas – 13 €\n- Corte Fuera Horario – 30 €\n- Corte + Mechas – 50 €\n- Servicio a Domicilio – 50 €',
        'Here are our prices:\n- Blackhead Mask – €10\n- Beard Trim – €10\n- Fade Haircut – €12\n- Fade + Beard – €15\n- Haircut + Eyebrows – €13\n- After Hours Haircut – €30\n- Haircut + Highlights – €50\n- Home Service – €50'
    ),
    'horario': this.getText(
        'Nuestro horario de atención es de lunes a sábado de 9:00 a 19:30.',
        'Our opening hours are Monday to Saturday from 9:00 AM to 7:30 PM.'
    ),
    'direccion': this.getText(
        'Estamos ubicados en Plaza Hort Satisfecho, 26, 46460 Silla, Valencia',
        'We are located at Plaza Hort Satisfecho, 26, 46460 Silla, Valencia'
    ),
    'productos': this.getText(
        'Tenemos varios productos disponibles:\n- Clipper Space X Versace – 109.99 €\n- Trimmer Skeleton – 129.99 €\n- Aceite para Barba – 18.99 €\n- Champú para Barba – 2.99 €\n- Sillón de barbería negro – 250 €\n- Tijeras de corte 6" – 10.99 €\n- Capa negra – 9.99 €\n- Peine Rulo – 3.99 € .\nAccede a la sección de productos para ver los productos disponibles en la web.',
        'We have several products available:\n- Clipper Space X Versace – €109.99\n- Trimmer Skeleton – €129.99\n- Beard Oil – €18.99\n- Beard Shampoo – €2.99\n- Black Barber Chair – €250\n- 6" Cutting Scissors – €10.99\n- Black Cape – €9.99\n- Roller Comb – €3.99.\nVisit the products section to see the available items on our website.'
    ),
    'compra': this.getText(
        'Al realizar la compra, no podrás pagar a través de la web. Deberás acercarte al local para completar el pago. Sin embargo, tus productos serán reservados especialmente para ti.',
        'When making a purchase, you will not be able to pay through the website. You will need to come to the shop to complete the payment. However, your products will be reserved especially for you.'
    ),
    'cita': this.getText(
        'Para agendar una cita, puedes hacerlo a través de nuestra aplicación o llamarnos directamente al número que aparece en nuestra página web.',
        'To book an appointment, you can do so through our app or by calling us directly at the number listed on our website.'
    ),
    'peluquero': this.getText(
        'Contamos con tres tipos de barberos, cada uno especializado para adaptarse a las necesidades y preferencias de cada cliente. Accede a la sección de sobre nosotros para más información.',
        'We have three types of barbers, each specialized to meet the needs and preferences of every client. Visit the "About Us" section for more information.'
    ),
    'default': this.getText(
        'Lo siento, no tengo información sobre eso. Te sugiero que contactes directamente con nuestro equipo para más detalles.',
        'I´m sorry, I don’t have information about that. I suggest you contact our team directly for more details.'
    )
};


  ngOnInit() {
    this.messages.push({
      sender: 'assistant',
      text: '¡Hola! Soy el asistente virtual de Hairbooking. ¿En qué puedo ayudarte hoy?'
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.toLowerCase();
    this.messages.push({ sender: 'user', text: this.userInput });
    this.userInput = '';
    this.isLoading = true;

    // Simular tiempo de respuesta
    setTimeout(() => {
      let respuesta = this.respuestas.default;
      
      // Buscar palabras clave en el mensaje
      if (userMessage.includes('hola') || userMessage.includes('buenas')) {
        respuesta = this.respuestas.hola;
      } else if (userMessage.includes('precio') || userMessage.includes('cuesta') || userMessage.includes('valor')  || userMessage.includes('servicio')) {
        respuesta = this.respuestas.precios;
      } else if (userMessage.includes('hora') || userMessage.includes('horario') || userMessage.includes('abierto')) {
        respuesta = this.respuestas.horario;
      } else if (userMessage.includes('donde') || userMessage.includes('direccion') || userMessage.includes('ubicacion')) {
        respuesta = this.respuestas.direccion;
      } else if (userMessage.includes('producto') || userMessage.includes('tienda')) {
        respuesta = this.respuestas.productos;
      } 
      else if (userMessage.includes('compra') || userMessage.includes('tarjeta') || userMessage.includes('tienda')) {
        respuesta = this.respuestas.compra;
      }
      else if (userMessage.includes('cita') || userMessage.includes('reservar') || userMessage.includes('reservo')|| userMessage.includes('agendar')) {
        respuesta = this.respuestas.cita;
      }
       else if (userMessage.includes('peluquero') || userMessage.includes('peluqueros') || userMessage.includes('barber') || userMessage.includes('barberos')  || userMessage.includes('servicio')) {
        respuesta = this.respuestas.peluquero;
      }

      this.messages.push({ sender: 'assistant', text: respuesta });
      this.isLoading = false;
    }, 1000);
  }
}
