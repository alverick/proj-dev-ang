import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { isEmpty } from 'ramda';
import { isNotEmpty } from 'ramda-adjunct';
import { Observable } from 'rxjs';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class AffiliationServiceValidGuard implements CanActivate {
  constructor(
    private affiliation: AffiliationService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
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
      this.router.navigate([redirect], {
        skipLocationChange: this.router.url === redirect,
      });
      console.log('nav', {
        skipLocationChange: this.router.url === redirect,
      });
    }
    return isEmpty(redirect);
  }
}
