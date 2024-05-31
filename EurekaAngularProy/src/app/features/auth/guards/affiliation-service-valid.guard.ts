import { Injectable } from '@angular/core';
import { type UrlTree, Router } from '@angular/router';
import { isEmpty } from 'ramda';
import { isNotEmpty } from 'ramda-adjunct';
import { type Observable } from 'rxjs';

import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class AffiliationServiceValidGuard {
  constructor(
    private affiliation: AffiliationService,
    private router: Router
  ) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let redirect = '';
    if (isEmpty(this.affiliation.serviceForm.value.name)) {
      redirect = authFullRoutingNames.COMPANY_REGISTER;
      if (!isEmpty(this.affiliation.servicesList)) {
        redirect = authFullRoutingChildNames.SERVICES_ADD_LIST;
      }
    }
    if (isNotEmpty(redirect)) {
      void this.router.navigate([redirect], {
        skipLocationChange: this.router.url === redirect,
      });
    }
    return isEmpty(redirect);
  }
}
