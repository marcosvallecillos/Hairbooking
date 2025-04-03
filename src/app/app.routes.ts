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
import { CarritoComponent } from './views/carrito/carrito.component';
import { ModalCompraComponent } from './components/modal-compra/modal-compra.component';
import { ShowReserveComponent } from './views/show-reserve/show-reserve.component';
import { ShowBuysComponent } from './views/show-buys/show-buys.component';
import { NgModule } from '@angular/core';

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
    { path: 'carrito', component: CarritoComponent },
    { path: 'confirm-compra', component: ModalCompraComponent },
    { path: 'show-reserve', component: ShowReserveComponent },
    { path: 'show-buys', component: ShowBuysComponent },
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
