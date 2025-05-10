import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  
  constructor(private jwtService: JwtService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['requiredPermission'];
    console.log('PermissionGuard: requiredPermission =', requiredPermission);
  
    if (!requiredPermission) {
      console.log('PermissionGuard: nessun permesso richiesto, accesso consentito');
      return true;
    }
  
    const hasPerm = this.jwtService.hasPermission(requiredPermission);
    console.log(`PermissionGuard: utente ha permesso "${requiredPermission}"?`, hasPerm);
  
    if (hasPerm) {
      return true;
    }
  
    console.warn('PermissionGuard: accesso negato, reindirizzo a /access-denied');
    return false;
  }
}