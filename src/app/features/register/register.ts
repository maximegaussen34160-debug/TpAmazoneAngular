import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink} from '@angular/router';
import { HashService } from '../../hash';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

	// Variables pour stocker les résultats

	finalHash: string = '';

	constructor(private hashService: HashService, private http: HttpClient) { }


	register() {
		this.http.post('http://localhost:8080/user/sel', { name : this.nameInput, mail: this.mailInput })
			.subscribe((res: any) => {
				console.log(res.salt)
				if (res.salt) {

					this.finalHash = this.hashService.hashPassword(this.passwordInput, res.salt);
					console.log(this.nameInput);
					console.log(this.mailInput);
					console.log(this.finalHash);
					this.http.post('http://localhost:8080/register',
						{
							name: this.nameInput,
							identifiant: this.mailInput,
							pswd: this.finalHash
						}
					)
						.subscribe(res => {
							console.log(res);
						}
						);
				}
			}
			);

	}
}
