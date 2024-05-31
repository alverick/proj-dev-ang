import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { authFullRoutingNames } from '../../features/auth/auth-routing.names';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(): boolean {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    const session = this.storageService.getCurrentSession();
    if (session?.isAuthenticate) {
      return true;
    } else {
      void this.router.navigate([authFullRoutingNames.LOGIN]);
      return false;
    }
  }
}
