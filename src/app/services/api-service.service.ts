import { Injectable, ResourceRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap } from 'rxjs';
import { Compra, Product, Reserva, Usuario } from '../models/user.interface';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
private apiUrl = 'http://localhost:8000/api';
private apiUrlUsuarios = 'http://localhost:8000/api/usuarios'
private apiUrlReservas = 'http://localhost:8000/api/reservas'
private apiUrlProductos = 'http://localhost:8000/api/productos'
private apiUrlCompras = 'http://localhost:8000/api/compras'

public productos: Product[] = [];
private favorites: Product[] = [];
private reserves: Reserva[] = [];
private cart: Product[] = [];
public cartItemsCount = new BehaviorSubject<number>(0);
cartItemsCount$ = this.cartItemsCount.asObservable();

constructor(private http: HttpClient, private authService: AuthService) { }
 
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
  return this.http.delete<any>(`${this.apiUrlUsuarios}/${id}`);
}
getReserves(): Observable<Reserva[]> {
  return this.http.get<Reserva[]>(`${this.apiUrlReservas}`);
}

addReserve(reserve: Reserva) {
  this.reserves.push({ ...reserve, id: this.reserves.length + 1 }); 
}

getReserveByUsuario(usuario_Id: number): Observable<Reserva[]> {
  return this.http.get<Reserva[]>(`${this.apiUrlReservas}/usuario/${usuario_Id}`);
}
newReserve(reservas: Reserva): Observable<Reserva> {
  return this.http.post<Reserva>(`${this.apiUrlReservas}/new`, reservas);
}

editReserve(id: number, reservaData: Reserva): Observable<Reserva> {
  return this.http.put<Reserva>(`${this.apiUrlReservas}/${id}/edit`, reservaData);
}
deleteReserve(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrlReservas}/${id}`);
}
removeReserve(reserveId: number) {
  this.reserves = this.reserves.filter((r) => r.id !== reserveId);
}

getReserveById(reserveId: number): Reserva | undefined {
  return this.reserves.find((r) => r.id === reserveId);
}

makePurchase(purchase: Compra, usuarioId: number): Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  return this.http.post<any>(`${this.apiUrlCompras}/usuarios/${usuarioId}/compras`, purchase, httpOptions).pipe(
    tap(response => {
      console.log('Respuesta del servidor en makePurchase:', response);
      if (response.status === 'success') {
        this.clearCart();
      }
    })
  );
}
getPurchasesByUsuarioId(usuario_Id: number): Observable<Compra[]> {
  return this.http.get<Compra[]>(`${this.apiUrlCompras}/usuario/${usuario_Id}`);
}


getAllProductos():Observable<Product[]>{
  return this.http.get<Product[]>(`${this.apiUrlProductos}/list`)
}
getProductos(): Product[] {
  return this.productos;
}

addProduct(product: Product) {
  const existingProduct = this.productos.find((p) => p.id === product.id);
  if (!existingProduct) { 
    product.cantidad = 1;
    product.cart = true;
    this.productos.push(product);
    this.updateCartItemsCount();
  }
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
  }).pipe(
    tap((response: any) => {
      if (response.status === 'success') {
        // Actualizar el estado del carrito
        this.getCartByUsuarioId(userId).subscribe({
          next: (cartResponse: any) => {
            if (cartResponse.status === 'success' && cartResponse.carrito) {
              this.productos = cartResponse.carrito.map((producto: any) => ({
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
          }
        });
      }
    })
  );
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

removeProduct(productId: number) {
  this.productos = this.productos.filter((p) => p.id !== productId);
  this.updateCartItemsCount();
}

updateQuantity(productId: number, quantity: number) {
  const product = this.productos.find((p) => p.id === productId);
  if (product) {
    product.cantidad = quantity;
    this.updateCartItemsCount();
  }
}

 updateCartItemsCount() {
  const totalItems = this.productos.reduce(
    (sum, product) => sum + (product.cantidad || 0),
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

removeFavorite(productId: number) {
  this.favorites = this.favorites.filter(p => p.id !== productId);
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

getCart(): Product[] {
  return this.cart;
}

private comprasRealizadas: Compra[] = [];



addToPurchases(products: Product[]): void {
  const nuevaCompra: Compra = {
    id: this.comprasRealizadas.length + 1,
    name: `Compra ${this.comprasRealizadas.length + 1}`, 
    image: 'default.jpg', 
    cantidad: products.reduce((sum, p) => sum + p.cantidad, 0), 
    price: products.reduce((sum, p) => sum + p.price * p.cantidad, 0), 
    fecha: new Date(), 
    productos: products.map(p => ({
      productoId: p.id,
      cantidad: p.cantidad
    }))
  };
  this.comprasRealizadas.push(nuevaCompra);
  console.log('Compra realizada:', nuevaCompra);
}


getPurchases(): Compra[] {
  return this.comprasRealizadas; 
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

  return this.http.post(`${this.apiUrlProductos}/carrito/eliminar/${productId}?usuario_id=${userId}`, {}).pipe(
    tap((response: any) => {
      if (response.status === 'success') {
        this.productos = this.productos.filter(p => p.id !== productId);
        this.updateCartItemsCount();
      }
    })
  );
}
} 