import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  itemCount: number = 0;
  isCheckingOut: boolean = false;
  notification: { message: string; type: 'success' | 'error' } | null = null;

  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
      this.itemCount = this.cartService.getItemCount();
    });
  }

  updateQuantity(productId: number, change: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0 && newQuantity <= item.product.stock) {
        this.cartService.updateQuantity(productId, newQuantity);
      }
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    if (this.cartItems.length === 0) return;
    
    this.isCheckingOut = true;
    
    // Mettre à jour le stock de chaque produit
    const updates = this.cartItems.map(item => {
      const newStock = item.product.stock - item.quantity;
      return this.productService.update(item.product.id!, { 
        ...item.product, 
        stock: newStock 
      }).toPromise();
    });

    Promise.all(updates)
      .then(() => {
        this.cartService.clearCart();
        this.isCheckingOut = false;
        this.showNotification('Commande validée ! Merci pour votre achat.', 'success');
        setTimeout(() => this.router.navigate(['/catalog']), 2000);
      })
      .catch(err => {
        console.error('Erreur checkout:', err);
        this.isCheckingOut = false;
        this.showNotification('Erreur lors de la commande', 'error');
      });
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }
}
