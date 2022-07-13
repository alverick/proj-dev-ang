import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { authFullRoutingNames } from '../../features/auth/auth-routing.names';

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
      location.href = authFullRoutingNames.LOGIN;
      return false;
    }
  }
}
