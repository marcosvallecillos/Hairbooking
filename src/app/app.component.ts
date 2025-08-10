import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api-service.service';
import { Usuario } from './models/user.interface';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component';
import { Form, FormGroup } from '@angular/forms';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeaderUserComponent,HeaderAdminComponent, ChatbotComponent, CookieConsentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isUserRegistered: string | null = null;
  isUser: boolean = false; 
  isLoggedIn: boolean = false;
  mostrarHeader: boolean = false;
  usuario: Usuario | null = null;
  isAdmin:boolean = false;
    constructor(private router: Router, private apiService: ApiService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url !== '/home-barber#jumbotron') {
          window.scrollTo(0, 0);
        }
        this.mostrarHeader = this.router.url !== '/index' ; 
        


      }
    });
  }

  
  ngOnInit() {
    this.actualizarEstadoUsuario();
    
    window.addEventListener("storage", () => {
      this.actualizarEstadoUsuario();
    });

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    
    this.router.events.subscribe(() => {
      this.mostrarHeader = this.router.url !== '/index' && this.router.url !== '/policy-cookies' && this.router.url !== '/privacy-policy'; 
    });
  }
  
  private actualizarEstadoUsuario() {
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('userData');
    
    this.isUserRegistered = userType || null;
    this.isUser = userType === 'usuario';
    this.isAdmin = userType === 'admin';
    this.isLoggedIn = !!userData;

    if (userData) {
      try {
        this.usuario = JSON.parse(userData);
        console.log('User data:', this.usuario);
      } catch (e) {
        this.usuario = null;
      }
    } else {
      this.usuario = null;
    }
  }

  logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    this.isUserRegistered = null;
    this.isUser = false;
    this.isLoggedIn = false;
    this.usuario = null;
    console.log('cerrando sesion')
    window.dispatchEvent(new Event("storage"));
    window.location.reload();
  }
}
