import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-register',
	imports: [RouterLink, CommonModule, FormsModule],
	templateUrl: './register.html',
	styleUrl: './register.scss',
})
export class Register {
	passwordInput: string = '';
	mailInput: string = '';
	nameInput: string = '';
	errorMessage: string = '';
	successMessage: string = '';
	isLoading: boolean = false;

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	register() {
		if (!this.nameInput || !this.mailInput || !this.passwordInput) {
			this.errorMessage = 'Veuillez remplir tous les champs.';
			return;
		}

		this.isLoading = true;
		this.errorMessage = '';
		this.successMessage = '';

		this.authService.register({
			name: this.nameInput,
			email: this.mailInput,
			password: this.passwordInput
		}).subscribe({
			next: (res) => {
				this.isLoading = false;
				this.successMessage = 'Compte créé avec succès ! Redirection...';
				setTimeout(() => {
					this.router.navigate(['/login']);
				}, 1500);
			},
			error: (err) => {
				this.isLoading = false;
				this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription.';
			}
		});
	}
}
