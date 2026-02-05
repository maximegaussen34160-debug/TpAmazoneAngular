import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Product } from './product.service';
import { AuthService } from './auth.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartItemDTO {
  productId: number;
  productName?: string;
  productPrice?: number;
  productDescription?: string;
  productStock?: number;
  productImageUrl?: string;
  quantity: number;
}

export interface UserCartResponse {
  userId: number;
  items: CartItemDTO[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = 'http://localhost:8080';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  
  cart$ = this.cartSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    // Charger le panier quand l'utilisateur change
    this.authService.currentUser$.subscribe(user => {
      if (user?.id) {
        this.loadCartFromServer();
      } else {
        this.clearLocalCart();
      }
    });
  }

  private clearLocalCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
  }

  loadCartFromServer(): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;

    this.http.get<UserCartResponse>(`${this.apiUrl}/users/${userId}/cart`).pipe(
      catchError(() => of({ userId: userId, items: [] }))
    ).subscribe(response => {
      this.cartItems = response.items.map(item => ({
        product: {
          id: item.productId,
          name: item.productName || '',
          price: item.productPrice || 0,
          description: item.productDescription || '',
          stock: item.productStock || 0,
          imageUrl: item.productImageUrl
        },
        quantity: item.quantity
      }));
      this.cartSubject.next([...this.cartItems]);
    });
  }

  private saveCartToServer(): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;

    const items: CartItemDTO[] = this.cartItems.map(item => ({
      productId: item.product.id!,
      quantity: item.quantity
    }));

    this.http.put<UserCartResponse>(`${this.apiUrl}/users/${userId}/cart`, { items }).pipe(
      catchError(err => {
        console.error('Erreur sauvegarde panier:', err);
        return of(null);
      })
    ).subscribe();
  }

  addToCart(product: Product, quantity: number = 1): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }

    if (product.stock < quantity) {
      return false;
    }

    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        return false;
      }
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product: { ...product }, quantity });
    }

    this.cartSubject.next([...this.cartItems]);
    this.saveCartToServer();
    return true;
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.cartSubject.next([...this.cartItems]);
    this.saveCartToServer();
  }

  updateQuantity(productId: number, quantity: number): boolean {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (!item) return false;

    if (quantity > item.product.stock) {
      return false;
    }

    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      item.quantity = quantity;
      this.cartSubject.next([...this.cartItems]);
      this.saveCartToServer();
    }
    return true;
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
    this.saveCartToServer();
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  // Passer commande - retire du stock réellement
  checkout(): Observable<{ success: boolean; message: string }> {
    const userId = this.authService.currentUser?.id;
    if (!userId) {
      return of({ success: false, message: 'Non connecté' });
    }

    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/users/${userId}/checkout`, {}).pipe(
      tap(response => {
        if (response.success) {
          this.cartItems = [];
          this.cartSubject.next([]);
        }
      }),
      catchError(err => {
        console.error('Erreur checkout:', err);
        return of({ success: false, message: 'Erreur lors de la commande' });
      })
    );
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
