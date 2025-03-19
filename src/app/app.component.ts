import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeaderUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isUserRegistered: string | null = null;

  ngOnInit() {
    this.actualizarEstadoUsuario();
    
    window.addEventListener("storage", () => {
      this.actualizarEstadoUsuario();
    });
  }

  private actualizarEstadoUsuario() {
    const userType = localStorage.getItem('userType');
    this.isUserRegistered = userType || null;
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('userData');
    this.isUserRegistered = "invitado";
    window.dispatchEvent(new Event("storage"));
  }
}
