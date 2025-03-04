import { Injectable } from '@angular/core';
import { Router, type UrlTree } from '@angular/router';
import { type Observable } from 'rxjs';

import { internalFullRoutingNames } from '../../features/internal/internal-routing.names';

@Injectable()
export class GtpInputGuard {
  constructor(private readonly router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (parseInt(sessionStorage.getItem('prfl'), 10) !== 1) {
      void this.router.navigate([internalFullRoutingNames.HOME]);
    }
    return true;
  }
}
