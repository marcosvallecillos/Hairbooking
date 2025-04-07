import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api-service.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeaderUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isUser: boolean = false;  

  toggleUser() {
    this.isUser = !this.isUser;
  }

  isLoggedIn: boolean = false;
  mostrarHeader: boolean = false;
  
  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {
    this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      window.scrollTo(0, 0); 
    }
  });}

  ngOnInit() {
    this.isUser = this.apiService.getIsUser();

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    this.router.events.subscribe(() => {
      this.mostrarHeader = this.router.url !== '/index'; 
    });
  }
}
