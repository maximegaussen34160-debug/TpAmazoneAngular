import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface CartItemDTO {
  productId: number;
  quantity: number;
}

export interface UserCart {
  userId: number;
  items: CartItemDTO[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = 'http://localhost:8080';
  
  private usersSubject = new BehaviorSubject<UserInfo[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(`${this.apiUrl}/users`).pipe(
      tap(users => this.usersSubject.next(users))
    );
  }

  // Mettre à jour le rôle d'un utilisateur
  updateUserRole(userId: number, role: 'ADMIN' | 'USER'): Observable<UserInfo> {
    return this.http.patch<UserInfo>(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  // Récupérer le panier d'un utilisateur
  getUserCart(userId: number): Observable<UserCart> {
    return this.http.get<UserCart>(`${this.apiUrl}/users/${userId}/cart`);
  }

  // Sauvegarder le panier d'un utilisateur
  saveUserCart(userId: number, items: CartItemDTO[]): Observable<UserCart> {
    return this.http.put<UserCart>(`${this.apiUrl}/users/${userId}/cart`, { items });
  }

  // Ajouter un item au panier
  addToCart(userId: number, productId: number, quantity: number): Observable<UserCart> {
    return this.http.post<UserCart>(`${this.apiUrl}/users/${userId}/cart`, { productId, quantity });
  }

  // Supprimer un item du panier
  removeFromCart(userId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}/cart/${productId}`);
  }

  // Vider le panier
  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}/cart`);
  }

  // Passer commande (retire du stock)
  checkout(userId: number): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/users/${userId}/checkout`, {});
  }
}
