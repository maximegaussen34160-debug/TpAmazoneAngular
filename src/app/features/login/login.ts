import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

}
