import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isNotNilOrEmpty } from 'ramda-adjunct';

import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class AffiliationCompanyIdGuard {
  constructor(
    private readonly affiliation: AffiliationService,
    private readonly router: Router,
  ) {}
  canActivateChild() {
    if (!isNotNilOrEmpty(this.affiliation.companyId)) {
      void this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
    }
    return isNotNilOrEmpty(this.affiliation.companyId);
  }
}
