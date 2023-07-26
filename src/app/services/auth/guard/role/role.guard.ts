import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { FirebaseService } from '../../../firebase/firebase.service';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(public auth: AuthService, public router: Router, private fire: FirebaseService) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    if (!this.auth.loggedInStatus.getValue() || this.fire.userType.getValue() !== expectedRole) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
