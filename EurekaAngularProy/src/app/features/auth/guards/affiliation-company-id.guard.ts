import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { Observable } from 'rxjs';
import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class AffiliationCompanyIdGuard implements CanActivateChild {
  constructor(
    private affiliation: AffiliationService,
    private router: Router
  ) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!isNotNilOrEmpty(this.affiliation.companyId)) {
      this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
    }
    return isNotNilOrEmpty(this.affiliation.companyId);
  }
}
