import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

}
