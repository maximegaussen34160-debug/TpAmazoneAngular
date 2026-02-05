import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class='contact-page'>
      <h1><i class="fa-solid fa-envelope"></i> Contactez-nous</h1>
      <section class="contact-section">
        <p>
          Une question, une suggestion, une déclaration d'amour à notre site ? Remplissez le formulaire ci-dessous, on vous répondra peut-être !
        </p>
        <form class="contact-form" (submit)="onSubmit($event)">
          <label>
            <i class="fa-solid fa-user"></i> Votre email :<br>
            <input type="email" name="email" required placeholder="ex: user@ishop.com">
          </label>
          <label>
            <i class="fa-solid fa-comment"></i> Message :<br>
            <textarea name="message" required placeholder="Votre message (ou blague)"></textarea>
          </label>
          <button type="submit"><i class="fa-solid fa-paper-plane"></i> Envoyer</button>
        </form>
        <div *ngIf="sent" class="contact-success">
          <i class="fa-solid fa-circle-check"></i> Merci pour votre message ! On le lira peut-être un jour.
        </div>
      </section>
      <section class="contact-info">
        <h2><i class="fa-solid fa-info-circle"></i> Nos coordonnées</h2>
        <ul>
          <li><i class="fa-solid fa-envelope"></i> Email : support@ishop.com (ne répond jamais)</li>
          <li><i class="fa-solid fa-phone"></i> Téléphone : 01 23 45 67 89 (ne décroche jamais)</li>
          <li><i class="fa-solid fa-location-dot"></i> Adresse : 42 rue de l'Invention, 75000 Paris</li>
        </ul>
      </section>
    </div>
  `,
  styleUrls: ['./contact.scss']
})
export class Contact {
  sent = false;
  onSubmit(event: Event) {
    event.preventDefault();
    this.sent = true;
    setTimeout(() => this.sent = false, 4000);
  }
}
