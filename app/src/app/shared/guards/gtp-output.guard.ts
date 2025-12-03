import { inject, Injectable } from '@angular/core';
import { Router, type UrlTree } from '@angular/router';
import { type Observable } from 'rxjs';

import { appFullRoutingNames } from '../../app-routing.names';

@Injectable()
export class GtpOutputGuard {
  private readonly router = inject(Router);

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (parseInt(sessionStorage.getItem('prfl'), 10) !== 0) {
      void this.router.navigate([appFullRoutingNames.ADMIN]);
    }
    return true;
  }
}
