import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  decodedToken: { [key: string]: any } | null = null;

  constructor() {
    this.decodeToken();
  }

  getToken(): string | null {
    return window.localStorage.getItem('jwtTokenMessier');
  }

  decodeToken(): void {
    const jwtToken = this.getToken();
    if (jwtToken) {
      try {
        this.decodedToken = jwt_decode(jwtToken);
      } catch (e) {
        console.error('Errore nella decodifica del token', e);
        this.decodedToken = null;
      }
    } else {
      this.decodedToken = null;
    }
  }

  saveToken(token: string): void {
    window.localStorage.setItem('jwtTokenMessier', token);
    this.decodeToken(); // aggiorna decodedToken subito dopo il salvataggio
  }

  destroyToken(): void {
    window.localStorage.removeItem('jwtTokenMessier');
    this.decodedToken = null; // resetta decodedToken
  }

  getExpiryTime(): number | null {
    return this.decodedToken?.['exp'] ?? null;
  }

  isTokenExpired(): boolean {
    const expiryTime = this.getExpiryTime();
    if (expiryTime) {
      return expiryTime * 1000 < Date.now();
    } else if (this.decodedToken?.['iat']) {
      const issuedAt = this.decodedToken['iat'] * 1000;
      const tokenDurationMs = 3600 * 1000; // 1 ora
      return (issuedAt + tokenDurationMs) < Date.now();
    }
    return true;
  }

  logDecodedToken(): void {
    this.decodeToken();
    console.log('Decoded JWT token:', this.decodedToken);
  }

  getUser(): any {
    return this.decodedToken?.['data'] ?? null;
  }

  getUserRole(): string | null {
    return this.decodedToken?.['data']?.role ?? null;
  }

  hasPermission(permission: string): boolean {
    // Non serve chiamare decodeToken qui se decodifichi subito dopo il salvataggio
    return !!this.decodedToken?.['data']?.permissions?.includes(permission);
  }

  hasRole(allowedRoles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? allowedRoles.includes(userRole) : false;
  }
}
