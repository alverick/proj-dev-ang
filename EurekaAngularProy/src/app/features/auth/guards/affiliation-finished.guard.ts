import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
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
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('email', this.affiliation.email);
    if (isNilOrEmpty(this.affiliation.email)) {
      this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
    }
    return !isNilOrEmpty(this.affiliation.email);
  }
}
