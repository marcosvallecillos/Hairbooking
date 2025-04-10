import { Injectable, ResourceRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Compra, Product, Reserva, Usuario } from '../models/user.interface';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
private apiUrl = 'http://localhost:8000/api';
private isUserSubject = new BehaviorSubject<boolean>(true); 
public productos: Product[] = [];
private favorites: Product[] = [];


private reserves: Reserva[] = [];
private cart: Product[] = [];
public cartItemsCount = new BehaviorSubject<number>(0);
isUser: boolean = true  ;
cartItemsCount$ = this.cartItemsCount.asObservable();
  isUser$ = this.isUserSubject.asObservable();
  constructor(private http: HttpClient) { 
    this.isUserSubject.next(this.isUser);
  }
 
  registerUser(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }
  loginUser(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password });
  }
  logoutUser(): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/logout`, {});
  }

  getIsUser(): boolean {
    return this.isUser;
  }
  getProductos(): Product[] {
    return this.productos;
  }

  addProduct(product: Product) {
    const existingProduct = this.productos.find((p) => p.id === product.id);
    if (!existingProduct) { 
      product.cantidad = 1;
      this.productos.push(product);
    }
    this.updateCartItemsCount();
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

  private updateCartItemsCount() {
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

  getFavorites(): Product[] {
    return this.favorites;
  }

  getCart(): Product[] {
    return this.cart;
  }

  private comprasRealizadas: Compra[] = [];

addToPurchases(products: Product[]): void {
  const nuevaCompra: Compra = {
    id: this.comprasRealizadas.length + 1,
    name: ` ${this.comprasRealizadas.length + 1}`, 
    image: '', 
    cantidad: products.reduce((sum, p) => sum + p.cantidad, 0), 
    price: products.reduce((sum, p) => sum + p.price * p.cantidad, 0), 
    fecha: new Date(), 
    productos: products, 
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
  getReserves(): Reserva[] {
    return this.reserves;
  }

  addReserve(reserve: Reserva) {
    this.reserves.push({ ...reserve, id: this.reserves.length + 1 }); 
  }

  removeReserve(reserveId: number) {
    this.reserves = this.reserves.filter((r) => r.id !== reserveId);
  }

  getReserveById(reserveId: number): Reserva | undefined {
    return this.reserves.find((r) => r.id === reserveId);
  }

} 