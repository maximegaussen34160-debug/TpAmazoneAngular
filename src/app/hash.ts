import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class HashService {

  // Hash SHA-256 en Hexadécimal (compatible avec Java)
  hash(text: string): string {
    const hash = CryptoJS.SHA256(text);
    return CryptoJS.enc.Hex.stringify(hash);
  }
}