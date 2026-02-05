import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { AdminPanel } from './components/admin-panel/admin-panel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, AdminPanel],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TpAmazoneAngular');
}
