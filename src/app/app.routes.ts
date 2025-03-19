import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AboutUsComponent } from './views/about-us/about-us.component';
import { ListPriceComponent } from './views/list-price/list-price.component';
import { ReserveComponent } from './views/reserve/reserve.component';
import { ModalLoginComponent } from './components/modal-login/modal-login.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';

export const routes: Routes = [ 
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'list-price', component: ListPriceComponent },
    { path: 'reserve', component: ReserveComponent },
    { path: 'login', component: ModalLoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'header-user', component: HeaderUserComponent },

];

    
