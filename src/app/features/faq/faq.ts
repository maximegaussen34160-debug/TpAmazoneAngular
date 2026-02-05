import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class='faq-page'>
      <h1>FAQ</h1>
      <div class="accordion">
        <div class="accordion-item" *ngFor="let q of questions; let i = index">
          <button class="accordion-title" (click)="toggle(i)">
            {{ q.question }}
            <span>{{ opened === i ? '-' : '+' }}</span>
          </button>
          <div class="accordion-content" [class.open]="opened === i">
            <p>{{ q.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./faq.scss']
})
export class Faq {
  questions = [
    {
      question: "Comment devenir admin sur iShop ?",
      answer: "Il suffit d'obtenir le code secret... ou de soudoyer le développeur avec des cookies !"
    },
    {
      question: "Puis-je acheter un grille-pain connecté à l'IA ?",
      answer: "Bien sûr ! Mais il risque de vous donner des conseils de vie à chaque tartine."
    },
    {
      question: "Mon panier a disparu, que faire ?",
      answer: "Essayez de le retrouver dans la FAQ, sinon contactez-nous. Il aime parfois se cacher."
    },
    {
      question: "Pourquoi la FAQ est-elle aussi bizarre ?",
      answer: "Parce qu'on aime répondre à toutes les questions, même celles qu'on invente."
    },
    {
      question: "Est-ce que les produits sont vraiment livrés ?",
      answer: "On ne sait pas, personne n'a encore essayé d'en commander !"
    }
  ];
  opened: number|null = null;
  toggle(i: number) {
    this.opened = this.opened === i ? null : i;
  }
}
