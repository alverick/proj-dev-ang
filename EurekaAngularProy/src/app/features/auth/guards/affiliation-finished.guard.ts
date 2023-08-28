import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isNilOrEmpty } from 'ramda-adjunct';
import { Observable } from 'rxjs';

import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AffiliationFinishedGuard implements CanActivate {
  constructor(
    private affiliation: AffiliationService,
    private router: Router
  ) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (isNilOrEmpty(this.affiliation.email)) {
      void this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
    }
    return !isNilOrEmpty(this.affiliation.email);
  }
}
