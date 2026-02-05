import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `<div class='about-page'><h1>À propos</h1><p>Page fictive à propos du site.</p></div>`,
  styleUrl: './about.scss'
})
export class About {}
