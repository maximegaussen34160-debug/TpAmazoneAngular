import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class='about-page'>
      <h1><i class="fa-solid fa-apple-whole"></i> À propos de iShop</h1>
      <section class="about-section">
        <h2><i class="fa-solid fa-bullseye"></i> Notre mission</h2>
        <p>
          Offrir une expérience d'achat unique, où vous pouvez acheter des produits improbables, gérer votre panier comme un pro, et même changer de rôle pour devenir admin (si vous avez le code magique !).
        </p>
      </section>
      <section class="about-section">
        <h2><i class="fa-solid fa-star"></i> Pourquoi nous choisir ?</h2>
        <ul>
          <li>Des produits qui n'existent nulle part ailleurs (et parfois même pas chez nous).</li>
          <li>Un panier qui se souvient de vous, même quand vous ne vous souvenez plus de lui.</li>
          <li>Un système de rôles pour que chacun puisse rêver d'être admin.</li>
          <li>Une FAQ qui répond à toutes vos questions, même les plus bizarres.</li>
        </ul>
      </section>
      <section class="about-section">
        <h2><i class="fa-solid fa-users"></i> L'équipe</h2>
        <p>
          iShop, c'est avant tout une équipe de passionnés de code, de design, et de blagues douteuses. Notre objectif : rendre votre navigation aussi agréable qu'inutilement fun.
        </p>
      </section>
      <section class="about-section">
        <h2><i class="fa-solid fa-envelope"></i> Contact</h2>
        <p>
          Une question ? Un bug ? Un compliment ? Rendez-vous sur la page Contact, on adore recevoir des messages (surtout les compliments).
        </p>
      </section>
    </div>
  `,
  styleUrls: ['./about.scss']
})
export class About {}
