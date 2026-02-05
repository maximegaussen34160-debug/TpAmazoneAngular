import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-page">
      <h1>Mon profil</h1>
      <div class="profile-card" *ngIf="user">
        <div class="avatar">
          <span>{{ user.name.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="profile-info">
          <div><b>Nom :</b> {{ user.name }}</div>
          <div><b>Email :</b> {{ user.email }}</div>
          <div><b>Rôle :</b> <span class="role-badge" [class.admin]="user.role === 'ADMIN'">{{ user.role }}</span></div>
        </div>
      </div>
      <div class="profile-extras">
        <h2>Mes avantages iShop</h2>
        <ul>
          <li>Accès à un panier persistant</li>
          <li>Possibilité de devenir admin (si tu as le code magique)</li>
          <li>Support prioritaire (en théorie)</li>
        </ul>
        <h2>Paramètres</h2>
        <button class="apple-btn" (click)="logout()">Se déconnecter</button>
      </div>
    </div>
  `,
  styleUrls: ['./profile.scss']
})
export class Profile {
  user: User | null = null;
  constructor(private readonly auth: AuthService) {
    this.auth.currentUser$.subscribe(u => this.user = u);
  }
  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }
}
