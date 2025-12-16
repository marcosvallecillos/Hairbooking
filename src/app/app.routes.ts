import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AboutUsComponent } from './views/about-us/about-us.component';
import { ListPriceComponent } from './views/list-price/list-price.component';
import { ReserveComponent } from './views/reserve/reserve.component';
import { ModalLoginComponent } from './components/modal-login/modal-login.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { ContactoComponent } from './views/contacto/contacto.component';
import { IndexComponent } from './views/index/index.component';
import { ShowProfileComponent } from './components/show-profile/show-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ProductsComponent } from './views/products/products.component';
import { CosmeticosComponent } from './components/cosmeticos/cosmeticos.component';
import { ModalCompraComponent } from './components/modal-compra/modal-compra.component';
import { ShowReserveComponent } from './views/show-reserve/show-reserve.component';
import { ShowBuysComponent } from './views/show-buys/show-buys.component';
import { FavoritosComponent } from './views/favoritos/favoritos.component';
import { RateServiceComponent } from './views/rate-service/rate-service.component';
import { ShowClientsComponent } from './views/show-clients/show-clients.component';
import { ReservationsComponent } from './views/reservations/reservations.component';
import { BoughtProductsComponent } from './views/bought-products/bought-products.component';
import { ValuedServicesComponent } from './views/valued-services/valued-services.component';
import { CreateUserComponent } from './views/create-user/create-user.component';
import { ModalUserComponent } from './components/modal-user/modal-user.component';
import { ReserveAdminComponent } from './views/reserve-admin/reserve-admin.component';
import { CancelledReserveComponent } from './views/cancelled-reserve/cancelled-reserve.component';
import { RatingServiceComponent } from './components/rating-service/rating-service.component';
import { PolicyCookiesComponent } from './views/policy-cookies/policy-cookies.component';
import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';
import { AdminGuard } from './guards/auth.guard';
import { AuthUserGuard } from './guards/auth-user.guard';
import { ModalCodeComponent } from './components/modal-code/modal-code.component';

export const routes: Routes = [ 
    { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'home-barber', component: HomeComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'list-price', component: ListPriceComponent },
    { path: 'reserve', component: ReserveComponent },
    { path: 'login', component: ModalLoginComponent },
    { path: 'header-user', component: HeaderUserComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'showProfile', component: ShowProfileComponent, canActivate: [AuthUserGuard] },
    { path: 'editProfile', component: EditProfileComponent, canActivate: [AuthUserGuard] },
    { path: 'products', component: ProductsComponent },
    { path: 'cosmetics', component: CosmeticosComponent },
    { path: 'confirm-compra', component: ModalCompraComponent },
    { path: 'show-reserve', component: ShowReserveComponent},
    { path: 'show-buys', component: ShowBuysComponent, canActivate: [AuthUserGuard] },
    { path: 'favorites', component: FavoritosComponent, canActivate: [AuthUserGuard] },
    { path: 'rate-service/:id', component: RateServiceComponent, canActivate: [AuthUserGuard] },
    { path: 'show-clients', component: ShowClientsComponent, canActivate: [AdminGuard] },
    { path: 'reservations', component: ReservationsComponent, canActivate: [AdminGuard] },
    { path: 'bought_products', component: BoughtProductsComponent, canActivate: [AdminGuard]},
    { path: 'valued_services', component: ValuedServicesComponent, canActivate: [AdminGuard] },
    { path: 'create-user', component: CreateUserComponent, canActivate: [AdminGuard] },
    {path: 'modal-user', component: ModalUserComponent, canActivate: [AdminGuard]},
    {path: 'modal-code', component: ModalCodeComponent, canActivate: [AdminGuard]},

    {path: 'reserve-admin', component: ReserveAdminComponent, canActivate: [AdminGuard]},
    {path: 'cancelled-reserve', component: CancelledReserveComponent, canActivate: [AdminGuard]},
    {path: 'rating-reserve', component: RatingServiceComponent},
    {path: 'policy-cookies', component: PolicyCookiesComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},

    
    
];


