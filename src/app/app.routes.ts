import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AboutUsComponent } from './views/about-us/about-us.component';
import { ListPriceComponent } from './views/list-price/list-price.component';
import { ReserveComponent } from './views/reserve/reserve.component';
import { ModalLoginComponent } from './components/modal-login/modal-login.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { ContactoComponent } from './views/contacto/contacto.component';
import { IndexComponent } from './views/index/index.component';
import { ModalRegisterComponent } from './components/modal-register/modal-register.component';
import { ShowProfileComponent } from './components/show-profile/show-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

export const routes: Routes = [ 
    { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'home-barber', component: HomeComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'list-price', component: ListPriceComponent },
    { path: 'reserve', component: ReserveComponent },
    { path: 'login', component: ModalLoginComponent },
    { path: 'register', component: ModalRegisterComponent },
    { path: 'header-user', component: HeaderUserComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'showProfile', component: ShowProfileComponent },
    { path: 'editProfile', component: EditProfileComponent },

];

    
