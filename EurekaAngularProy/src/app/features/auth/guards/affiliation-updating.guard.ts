import { Injectable } from '@angular/core';
import { type UrlTree, Router } from '@angular/router';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { type Observable } from 'rxjs';

import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class AffiliationUpdatingGuard {
  constructor(
    private affiliation: AffiliationService,
    private router: Router
  ) {}
  canActivateChild():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!isNotNilOrEmpty(this.affiliation.updateData)) {
      void this.router.navigate([authFullRoutingNames.LOGIN]);
    }
    return isNotNilOrEmpty(this.affiliation.updateData);
  }
}
