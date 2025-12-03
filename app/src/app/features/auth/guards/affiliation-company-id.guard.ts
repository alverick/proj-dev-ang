import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isNotNilOrEmpty } from 'ramda-adjunct';

import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class AffiliationCompanyIdGuard {
  private readonly affiliation = inject(AffiliationService);
  private readonly router = inject(Router);

  canActivateChild() {
    if (!isNotNilOrEmpty(this.affiliation.companyId)) {
      void this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
    }
    return isNotNilOrEmpty(this.affiliation.companyId);
  }
}
