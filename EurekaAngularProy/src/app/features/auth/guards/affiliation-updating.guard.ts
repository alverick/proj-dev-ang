import { Injectable } from '@angular/core';
import { CanActivateChild, Router, UrlTree } from '@angular/router';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { Observable } from 'rxjs';

import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class AffiliationUpdatingGuard implements CanActivateChild {
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
