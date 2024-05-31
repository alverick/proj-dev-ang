import { Injectable } from '@angular/core';
import { type UrlTree, Router } from '@angular/router';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { type Observable } from 'rxjs';

import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class AffiliationRucGuard {
  constructor(
    private affiliation: AffiliationService,
    private router: Router
  ) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!isNotNilOrEmpty(this.affiliation.registerForm.value.ruc)) {
      void this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
    }
    return isNotNilOrEmpty(this.affiliation.registerForm.value.ruc);
  }
}
