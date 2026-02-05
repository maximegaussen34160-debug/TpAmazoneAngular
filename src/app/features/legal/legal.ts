import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class='legal-page'>
      <h1><i class="fa-solid fa-scale-balanced"></i> Mentions légales</h1>
      <section class="legal-section">
        <h2><i class="fa-solid fa-user-tie"></i> Éditeur du site</h2>
        <p>
          iShop, société fictive au capital de 1€<br>
          Siège social : 42 rue de l'Invention, 75000 Paris<br>
          RCS : 123 456 789 Paris<br>
          Directeur de la publication : Maxime Gaussen
        </p>
      </section>
      <section class="legal-section">
        <h2><i class="fa-solid fa-server"></i> Hébergement</h2>
        <p>
          Hébergé sur un serveur imaginaire, quelque part dans le cloud (ou sous un bureau).
        </p>
      </section>
      <section class="legal-section">
        <h2><i class="fa-solid fa-copyright"></i> Propriété intellectuelle</h2>
        <p>
          Tous les contenus de ce site sont la propriété de leurs auteurs, sauf ceux générés par IA ou trouvés sur Internet.
        </p>
      </section>
      <section class="legal-section">
        <h2><i class="fa-solid fa-shield-halved"></i> Protection des données</h2>
        <p>
          Nous ne collectons aucune donnée, sauf si vous nous les envoyez par erreur. Dans ce cas, on les oublie vite.
        </p>
      </section>
      <section class="legal-section">
        <h2><i class="fa-solid fa-envelope"></i> Contact</h2>
        <p>
          Pour toute question juridique, contactez notre avocat imaginaire à legal@ishop.com.
        </p>
      </section>
    </div>
  `,
  styleUrls: ['./legal.scss']
})
export class Legal {}
