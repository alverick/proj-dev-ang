import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { Observable } from 'rxjs';
import { authFullRoutingNames } from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AffiliationRucGuard implements CanActivate {
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
    if (!isNotNilOrEmpty(this.affiliation.registerForm.value.ruc)) {
      this.router.navigate([authFullRoutingNames.COMPANY_REGISTER]);
    }
    return isNotNilOrEmpty(this.affiliation.registerForm.value.ruc);
  }
}
