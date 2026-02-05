import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog implements OnInit {
  products: Product[] = [];
  isLoading = true;
  notification: { message: string; type: 'success' | 'error' } | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement produits:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Calcule le stock disponible (stock réel - quantité dans le panier)
  getAvailableStock(product: Product): number {
    const cartItems = this.cartService.getCartItems();
    const cartItem = cartItems.find(item => item.product.id === product.id);
    const inCart = cartItem ? cartItem.quantity : 0;
    return product.stock - inCart;
  }

  addToCart(product: Product): void {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      this.showNotification('Veuillez vous connecter pour ajouter au panier', 'error');
      setTimeout(() => this.router.navigate(['/login']), 1500);
      return;
    }

    const availableStock = this.getAvailableStock(product);
    if (availableStock <= 0) {
      this.showNotification('Produit en rupture de stock', 'error');
      return;
    }

    const success = this.cartService.addToCart(product, 1);
    if (success) {
      this.showNotification(`${product.name} ajouté au panier`, 'success');
      this.cdr.detectChanges();
    } else {
      this.showNotification('Stock insuffisant', 'error');
    }
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  getBadgeText(product: Product): string {
    const stock = this.getAvailableStock(product);
    if (stock === 0) return 'Rupture';
    if (stock <= 5) return 'Stock limité';
    return 'En stock';
  }

  getBadgeClass(product: Product): string {
    const stock = this.getAvailableStock(product);
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  }
}
