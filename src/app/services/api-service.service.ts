import { Injectable, ResourceRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap } from 'rxjs';
import { Compra, Product, Reserva, ReservaAnulada, Usuario, Valoracion, ValoracionesResponse, FilterDateResponse } from '../models/user.interface';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
private apiUrlUsuarios = 'https://hairbookingback-production.up.railway.app/api/usuarios'
private apiUrlReservas = 'https://hairbookingback-production.up.railway.app/api/reservas'
private apiUrlProductos = 'https://hairbookingback-production.up.railway.app/api/productos'
private apiUrlCompras = 'https://hairbookingback-production.up.railway.app/api/compras'
private apiUrlValoracion = 'https://hairbookingback-production.up.railway.app/api/valoracion'
private apiUrlContact = 'https://hairbookingback-production.up.railway.app/contact'
private apiUrlAnuladas = 'https://hairbookingback-production.up.railway.app/api/anuladas'
private apiUrlReservations = 'https://hairbookingback-production.up.railway.app/api/reservations' // es para q cuando pasen de la hora se eliminen en la base de datos de reservations
public productos: Product[] = [];
private favorites: Product[] = [];
private reserves: Reserva[] = [];
private cart: Product[] = [];
public cartItemsCount = new BehaviorSubject<number>(0);
cartItemsCount$ = this.cartItemsCount.asObservable();

constructor(private http: HttpClient, private authService: AuthService) { }
 

getAllUsers(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(`${this.apiUrlUsuarios}`);
}
registerUser(usuario: Usuario): Observable<Usuario> {
  return this.http.post<Usuario>(`${this.apiUrlUsuarios}/new`, usuario);
}

loginUser(email: string, password: string): Observable<any> {
  const body = {
    email: email,
    password: password
  };

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  return this.http.post(`${this.apiUrlUsuarios}/login`, body, httpOptions);
}
  
showProfile(id: number):Observable<Usuario>{
  return this.http.get<Usuario>(`${this.apiUrlUsuarios}/${id}`)
}
editProfile(id: number, userData: Usuario): Observable<Usuario> {
  return this.http.put<Usuario>(`${this.apiUrlUsuarios}/${id}/edit`, userData);
}
deleteUser(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrlUsuarios}/delete/${id}`);
}
getReserves(): Observable<Reserva[]> {
  return this.http.get<Reserva[]>(`${this.apiUrlReservas}`);
}

getReserveByUsuario(usuario_Id: number): Observable<Reserva[]> {
  return this.http.get<Reserva[]>(`${this.apiUrlReservas}/usuario/${usuario_Id}`);
}
newReserve(reservas: Reserva): Observable<Reserva> {
  return this.http.post<Reserva>(`${this.apiUrlReservas}/new`, reservas);
}
newReserveByAdmin(reservas: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrlReservas}/admin/new`, reservas);
}

editReserve(id: number, reservaData: Reserva): Observable<Reserva> {
  return this.http.put<Reserva>(`${this.apiUrlReservas}/${id}/edit`, reservaData);
}
deleteReserve(id: number): Observable<Reserva> { //lleva los eliminados a reserva_anuladas
  return this.http.delete<Reserva>(`${this.apiUrlReservas}/delete/${id}`);
}
deleteReserves(id: number): Observable<Reserva> { //lleva los eliminados a reserva_anuladas
  return this.http.delete<Reserva>(`${this.apiUrlReservas}/eliminar/${id}`);
}
filterReserveActivas(): Observable<Reserva[]> {
  return this.http.get<Reserva[]>(`${this.apiUrlReservas}/filter?tipo=activas`);
}

filterReserveExpiradas(): Observable<Reserva[]> {
  return this.http.get<Reserva[]>(`${this.apiUrlReservas}/filter?tipo=expiradas`);
}

filterByPrice(minPrice?: number, maxPrice?: number): Observable<any> {
  let url = `${this.apiUrlProductos}/filter/price`;
  const params: { [key: string]: string } = {};
  
  if (minPrice !== undefined) {
    params['min_price'] = minPrice.toString();
  }
  if (maxPrice !== undefined) {
    params['max_price'] = maxPrice.toString();
  }
  
  return this.http.get(url, { params });
}

filterByDate(date: Date): Observable<FilterDateResponse> {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const fechaStr = `${year}-${month}-${day}`;
    const url = `${this.apiUrlCompras}/filter/date?fecha=${fechaStr}`;
    console.log('Filter URL:', url);
    
    return this.http.get<FilterDateResponse>(url).pipe(
      tap({
        next: (response) => console.log('API Response:', response),
        error: (error) => console.error('API Error:', error)
      })
    );
}
newValoracion(valoracion: Valoracion): Observable<Valoracion> {
  return this.http.post<Valoracion>(`${this.apiUrlValoracion}/valoraciones`,valoracion,
    { headers: { 'Content-Type': 'application/json' } }
  );
}

deleteReservaAnulada(id:number):Observable <ReservaAnulada>{
  return this.http.delete<ReservaAnulada>(`${this.apiUrlAnuladas}/delete/${id}`);
}

getValoraciones(): Observable<ValoracionesResponse> {
  return this.http.get<ValoracionesResponse>(`${this.apiUrlValoracion}/list`);
}
deleteValoracion(id: number): Observable<Valoracion> {
  return this.http.delete<Valoracion>(`${this.apiUrlValoracion}/delete/${id}`);
}

getReservasAnuladas():Observable<ReservaAnulada[]>{
  return this.http.get<ReservaAnulada[]>(`${this.apiUrlAnuladas}/list`);
}

removeReserve(reserveId: number) {
  this.reserves = this.reserves.filter((r) => r.id !== reserveId);
}

getReserveById(id: number): Observable<Reserva> {
  return this.http.get<Reserva>(`${this.apiUrlReservas}/${id}`);
}
makePurchase(purchase: { productos: { productoId: number; cantidad: number; }[]; descuento?: number }, usuarioId: number): Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  return this.http.post<any>(`${this.apiUrlCompras}/usuarios/${usuarioId}/compras`, purchase, httpOptions).pipe(
    tap(response => {
      console.log('Respuesta del servidor en makePurchase:', response);
      if (response.mensaje === 'Compra registrada') {
        // Eliminar cada producto del carrito
        purchase.productos.forEach(producto => {
          this.eliminarDelCarrito(producto.productoId).subscribe();
        });
        
        // Vaciar el carrito localmente
        this.productos = [];
        this.updateCartItemsCount();
      }
    })
  );
}
getPurchasesByUsuarioId(usuario_Id: number): Observable<Compra[]> {
  return this.http.get<Compra[]>(`${this.apiUrlCompras}/usuario/${usuario_Id}`);
}
deletePurchase(id: number): Observable<Compra> {
  return this.http.delete<Compra>(`${this.apiUrlCompras}/delete/${id}`);
}

getCompras(): Observable<Compra[]> {
  return this.http.get<Compra[]>(`${this.apiUrlCompras}`);
}
getAllProductos():Observable<Product[]>{
  return this.http.get<Product[]>(`${this.apiUrlProductos}/list`)
}
getProductos(): Product[] {
  return this.productos;
}



updateProductFavorite(productId: number, isFavorite: boolean): Observable<any> {
  const userId = this.authService.getUserId();
  return this.http.post(`${this.apiUrlProductos}/favoritos/${productId}`, { 
    usuario_id: userId,
    isFavorite: isFavorite 
  });
}

getFavoritesByUsuarioId(usuario_Id: number): Observable<any> {
  return this.http.get(`${this.apiUrlProductos}/favoritos/usuario/${usuario_Id}`);
}
updateProductCart(productId: number, insidecart: boolean): Observable<any> {
  const userId = this.authService.getUserId();
  if (!userId) {
    return throwError(() => new Error('Usuario no encontrado'));
  }

  return this.http.post(`${this.apiUrlProductos}/carrito/${productId}`, { 
    usuario_id: userId,
    insidecart: insidecart 
  });
}

getCartByUsuarioId(usuario_Id: number): Observable<any> {
  const observable = this.http.get(`${this.apiUrlProductos}/carrito/usuario/${usuario_Id}`);
  
  observable.subscribe({
    next: (response: any) => {
      if (response.status === 'success' && response.carrito) {
        this.productos = response.carrito.map((producto: any) => ({
          id: producto.id,
          name: producto.name,
          price: producto.price,
          image: producto.image,
          cantidad: producto.cantidad || 1,
          isFavorite: producto.favorite,
          insidecart: producto.cart,
          categorias: producto.categoria,
          subcategorias: producto.subcategoria
        }));
        this.updateCartItemsCount();
      }
    },
    error: (error) => {
      console.error('Error fetching cart:', error);
    }
  });
  
  return observable;
}


 updateCartItemsCount() {
  const totalItems = this.productos.reduce(
    (sum, product) => sum + (product.cantidad ? product.cantidad : 0),
    0
  );
  this.cartItemsCount.next(totalItems);
}

addFavorite(product: Product) {
  const existingFavorite = this.favorites.find(p => p.id === product.id);
  if (!existingFavorite) {
    const productToAdd = { ...product, isFavorite: true };
    this.favorites.push(productToAdd);
  }
}

deleteProductFav(id: number): Observable<Product> {
  return this.http.delete<Product>(`${this.apiUrlProductos}/delete/${id}`);
}

addCart(product: Product) {
  const existingCart = this.cart.find(p => p.id === product.id);
  if (!existingCart) {
    const productToAdd = { ...product, insideCart: true };
    this.cart.push(productToAdd);
  }
}

removeCart(productId: number) {
  this.cart = this.cart.filter(p => p.id !== productId);
}

deleteProductCart(id: number): Observable<Product> {
  return this.http.delete<Product>(`${this.apiUrlProductos}/delete/${id}`);
}


  clearCart(): void {
    this.productos = [];
    this.updateCartItemsCount();
  }
  
eliminarDelCarrito(productId: number): Observable<any> {
  const userId = this.authService.getUserId();
  if (!userId) {
    return throwError(() => new Error('Usuario no encontrado'));
  }

  return this.http.post(`${this.apiUrlProductos}/carrito/eliminar/${productId}?usuario_id=${userId}`, {})
}

getHistorialCompras(usuarioId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrlCompras}/usuarios/${usuarioId}/historial`);
}

sendContactForm(contactData: {
  name: string;
  apellidos: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };
  
  return this.http.post<any>(this.apiUrlContact, contactData, httpOptions);
}

actualizarCantidad(productoId: number, data: { usuario_id: number, cantidad: number }): Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  return this.http.post(`${this.apiUrlProductos}/carrito/cantidad/${productoId}`, data, httpOptions).pipe(
    tap(response => {
      console.log('Respuesta del servidor al actualizar cantidad:', response);
    })
  );
}
} 