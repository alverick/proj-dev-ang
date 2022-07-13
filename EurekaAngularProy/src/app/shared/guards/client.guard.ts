import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { authFullRoutingNames } from '../../features/auth/auth-routing.names';
import { AfiliacionService } from '../services/afiliacion.service';

/*The auth guard is used to prevent unauthenticated users from accessing restricted routes */
@Injectable({
  providedIn: 'root',
})
export class ClientGuard implements CanActivate {
  constructor(private router: Router, private afiliacion: AfiliacionService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.afiliacion.idCompany <= 0) {
      this.router.navigate([authFullRoutingNames.GENERATE_PASSWORD]);
      return false;
    }
    return true;
  }
}
