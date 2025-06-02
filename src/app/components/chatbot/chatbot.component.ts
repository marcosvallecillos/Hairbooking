import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  private readonly respuestas = {
    'hola': '¡Hola! Soy el asistente virtual de Hairbooking. ¿En qué puedo ayudarte hoy?',
    'precios': 'Aquí tienes nuestros precios:\n- Mascarilla Puntos Negros – 10 €\n- Arreglo Barba – 10 €\n- Corte Degradado – 12 €\n- Degradado + Barba – 15 €\n- Corte + Cejas – 13 €\n- Corte Fuera Horario – 30 €\n- Corte + Mechas – 50 €\n- Servicio a Domicilio – 50 €',
    'horario': 'Nuestro horario de atención es de lunes a sábado de 9:00 a 19:30.',
    'direccion': 'Estamos ubicados en Plaza Hort Satisfecho, 26, 46460 Silla, Valencia',
    'productos': 'Tenemos varios productos disponibles:\n- Clipper Space X Versace – 109.99 €\n- Trimmer Skeleton – 129.99 €\n- Aceite para Barba – 18.99 €\n- Champú para Barba – 2.99 €\n- Sillón de barbería negro – 250 €\n- Tijeras de corte 6" – 10.99 €\n- Capa negra – 9.99 €\n- Peine Rulo – 3.99 € . \n Accede a la sección de productos para ver los productos disponibles en la web.',
    'compra': 'Al realizar la compra, no podrás pagar a través de la web. Deberás acercarte al local para completar el pago. Sin embargo, tus productos serán reservados especialmente para ti.',
    'cita': 'Para agendar una cita, puedes hacerlo a través de nuestra aplicación o llamarnos directamente al número que aparece en nuestra página web.',
    'default': 'Lo siento, no tengo información sobre eso. Te sugiero que contactes directamente con nuestro equipo para más detalles.'
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

      this.messages.push({ sender: 'assistant', text: respuesta });
      this.isLoading = false;
    }, 1000);
  }
}
