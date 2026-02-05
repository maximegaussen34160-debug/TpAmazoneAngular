import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface UserWithRole {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface PendingRoleChange {
  user: UserWithRole;
  newRole: 'ADMIN' | 'USER';
  code: string;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss'
})
export class AdminPanel implements OnInit {
  isOpen = false;
  users: UserWithRole[] = [];
  isLoading = false;
  notification: { message: string; type: 'success' | 'error' } | null = null;
  
  // Système de code de validation
  pendingChange: PendingRoleChange | null = null;
  codeInput = '';
  isValidating = false;

  constructor(
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(() => {
      this.loadUsers();
    });
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadUsers();
    }
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.pendingChange) {
      this.cancelRoleChange();
    } else {
      this.isOpen = false;
    }
  }

  loadUsers(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.users = [{
        id: currentUser.id || 1,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      }];
    } else {
      this.users = [];
    }
  }

  // Demander le changement de rôle (génère un code)
  requestRoleChange(user: UserWithRole, newRole: 'ADMIN' | 'USER'): void {
    if (user.role === newRole) return;
    
    // Générer un code et l'afficher dans la console
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log('='.repeat(50));
    console.log('🔐 CODE DE VALIDATION ADMIN');
    console.log(`Utilisateur: ${user.email}`);
    console.log(`Nouveau rôle: ${newRole}`);
    console.log(`CODE: ${code}`);
    console.log('='.repeat(50));
    
    this.pendingChange = {
      user,
      newRole,
      code: code
    };
    this.showNotification('Code affiché dans la console (F12)', 'success');
  }

  // Valider le code et appliquer le changement
  validateCode(): void {
    if (!this.pendingChange || !this.codeInput) return;
    
    this.isValidating = true;
    
    if (this.codeInput.toUpperCase() === this.pendingChange.code.toUpperCase()) {
      // Code correct - appliquer le changement
      const { user, newRole } = this.pendingChange;
      user.role = newRole;
      
      // Sauvegarder le rôle
      this.authService.updateCurrentUserRole(newRole);
      
      this.showNotification(`Rôle mis à jour : ${newRole === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}`, 'success');
      this.cancelRoleChange();
      this.loadUsers(); // Recharger pour afficher le nouveau rôle
    } else {
      this.showNotification('Code incorrect', 'error');
    }
    
    this.isValidating = false;
  }

  cancelRoleChange(): void {
    this.pendingChange = null;
    this.codeInput = '';
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  closePanel(): void {
    this.isOpen = false;
    this.cancelRoleChange();
  }
}
