import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeaderUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isUser: boolean = true;  

  toggleUser() {
    this.isUser = !this.isUser;
  }

  isLoggedIn: boolean = false;
  mostrarHeader: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      window.scrollTo(0, 0); 
    }
  });}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    this.router.events.subscribe(() => {
      this.mostrarHeader = this.router.url !== '/index'; 
    });
  }
}
