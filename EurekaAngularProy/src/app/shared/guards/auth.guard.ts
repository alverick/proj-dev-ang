import { Injectable } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  type CanActivate,
  type RouterStateSnapshot,
  Router,
} from '@angular/router';

import { authFullRoutingNames } from '../../features/auth/auth-routing.names';
import { StorageService } from '../services/storage.service';

/*The auth guard is used to prevent unauthenticated users from accessing restricted routes */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    const session = this.storageService.getCurrentSession();
    if (session && session.isAuthenticate) {
      return true;
    } else {
      void this.router.navigate([authFullRoutingNames.LOGIN]);
      return false;
    }
  }
}
