import { Injectable, ResourceRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, Productos, Reserva, Usuario } from '../models/user.interface';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
private apiUrl = 'http://localhost:8000/api';
private isUserSubject = new BehaviorSubject<boolean>(true); 
private productos: Productos[] = [];
private favorites: Productos[] = [];
private reserves: Reserva[] = [];
private cart: Productos[] = [];
private comprasRealizadas: Product[] = [];

public cartItemsCount = new BehaviorSubject<number>(0);
isUser: boolean = false  ;
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

  setIsUser(value: boolean) {
    this.isUser = value;
  }
  getIsUser(): boolean {
    return this.isUser;
  }
  getProductos(): Productos[] {
    return this.productos;
  }

  addProduct(product: Productos) {
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

  addFavorite(product: Productos) {
    const existingFavorite = this.favorites.find(p => p.id === product.id);
    if (!existingFavorite) {
      const productToAdd = { ...product, isFavorite: true };
      this.favorites.push(productToAdd);
    }
  }

  removeFavorite(productId: number) {
    this.favorites = this.favorites.filter(p => p.id !== productId);
  }

  getFavorites(): Productos[] {
    return this.favorites;
  }

  getCart(): Productos[] {
    return this.cart;
  }

  addToPurchases(products: Product[]): void {
    this.comprasRealizadas = [...this.comprasRealizadas, ...products];
  }

  getPurchases(): Product[] {
    return this.comprasRealizadas;
  }

  clearCart(): void {
    this.productos = [];
  }
  getReserves(): Reserva[] {
    return this.reserves;
  }

  addReserve(reserve: Reserva) {
    this.reserves.push({ ...reserve, id: this.reserves.length + 1 }); 
  }

} 