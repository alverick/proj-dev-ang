import { inject, Injectable } from '@angular/core';
import { Router, type UrlTree } from '@angular/router';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { type Observable } from 'rxjs';

import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class AffiliationRucGuard {
  private readonly affiliation = inject(AffiliationService);
  private readonly router = inject(Router);

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
