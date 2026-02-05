import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss'
})
export class AddProduct implements OnInit {
  product: Partial<Product> = {
    name: '',
    price: 0,
    description: '',
    stock: 0,
    imageUrl: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  canAddProduct = false;

  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est admin
    this.canAddProduct = this.authService.isAdmin();
    if (!this.canAddProduct) {
      this.errorMessage = 'Vous n\'avez pas les permissions pour ajouter des produits. Seuls les administrateurs peuvent le faire.';
    }
  }

  onSubmit(): void {
    if (!this.canAddProduct) {
      this.errorMessage = 'Permission refusée';
      return;
    }

    if (!this.product.name || !this.product.price || this.product.stock === undefined) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.create(this.product as Product).subscribe({
      next: (created) => {
        this.isLoading = false;
        this.successMessage = `Produit "${created.name}" créé avec succès !`;
        setTimeout(() => {
          this.router.navigate(['/catalog']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création du produit.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/catalog']);
  }
}
