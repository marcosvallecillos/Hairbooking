import { Routes,RouterModule } from '@angular/router';
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
import { NgModule } from '@angular/core';
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
    { path: 'showProfile', component: ShowProfileComponent },
    { path: 'editProfile', component: EditProfileComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'cosmetics', component: CosmeticosComponent },
    { path: 'confirm-compra', component: ModalCompraComponent },
    { path: 'show-reserve', component: ShowReserveComponent },
    { path: 'show-buys', component: ShowBuysComponent },
    { path: 'favorites', component: FavoritosComponent },
    { path: 'rate-service/:id', component: RateServiceComponent },
    { path: 'show-clients', component: ShowClientsComponent },
    { path: 'reservations', component: ReservationsComponent },
    { path: 'bought_products', component: BoughtProductsComponent},
    { path: 'valued_services', component: ValuedServicesComponent },
    { path: 'create-user', component: CreateUserComponent },
    {path: 'modal-user', component: ModalUserComponent},
    {path: 'reserve-admin', component: ReserveAdminComponent},
    {path: 'cancelled-reserve', component: CancelledReserveComponent},
    {path: 'rating-reserve', component: RatingServiceComponent}
    
];

    @NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top', 
    }),
  ],
  exports: [RouterModule],
})

export class AppModule {}
