import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { authFullRoutingNames } from '../../features/auth/auth-routing.names';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthGuard {
  private readonly router = inject(Router);
  private readonly storageService = inject(StorageService);

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
