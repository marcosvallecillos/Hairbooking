import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Productos, Usuario } from '../models/user.interface';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
private apiUrl = 'http://localhost:8000/api';
private isUserSubject = new BehaviorSubject<boolean>(true); 
private productos: Productos[] = [];
public cartItemsCount = new BehaviorSubject<number>(0);

// Observable to subscribe to the cart items count
cartItemsCount$ = this.cartItemsCount.asObservable();
  isUser$ = this.isUserSubject.asObservable();
  constructor(private http: HttpClient) { 
    this.productos = [
      {
        id: 1,
        name: 'CLIPPER SPACE X VERSACE',
        price: 109.99,
        image: '../../../../images/clipper/clipper_space.jpg',
        cantidad: 2,
        insidecart:true,
        isFavorite: false,
      },
      {
        id: 2,
        name: 'CLIPPER GOLD EDITION',
        price: 129.99,
        image: '../../../../images/clipper/clipper_wahl.jpg',
        cantidad: 1,
        insidecart:true,
        isFavorite: false,
      },
    ];
    this.updateCartItemsCount();
  }

  registerUser(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }
  loginUser(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password });
  }

  setIsUser(value: boolean) {
    this.isUserSubject.next(value);
  }
  getProductos(): Productos[] {
    return this.productos;
  }

  addProduct(product: Productos) {
    const existingProduct = this.productos.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.cantidad += 1;
    } else {
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
} 