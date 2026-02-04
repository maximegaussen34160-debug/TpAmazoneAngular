import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class HashService {

  // Générer un sel aléatoire
  generateSalt(length: number = 16): string {
    return CryptoJS.lib.WordArray.random(length).toString();
  }

  // Hacher le mot de passe avec le sel
  hashPassword(password: string, salt: string): string {
    // On combine le mot de passe et le sel
    // Formule : $Hash = \text{SHA256}(\text{password} + \text{salt})$
    return CryptoJS.SHA256(password + salt).toString();
  }
}