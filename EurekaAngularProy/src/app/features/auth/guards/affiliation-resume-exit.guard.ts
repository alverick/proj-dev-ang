import { Injectable } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
  type UrlTree,
  Router,
} from '@angular/router';
import { pathEq } from 'ramda';
import { type Observable } from 'rxjs';

import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../auth-routing.names';
import { swalMesssageExit } from '../constants';
import { type ServiceResumePage } from '../pages';

@Injectable()
export class AffiliationResumeExitGuard {
  constructor(private router: Router) {}
  canDeactivate(
    _component: ServiceResumePage,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentNavigation = this.router.getCurrentNavigation();
    if (pathEq(['extras', 'state', 'navigateValid'], true, currentNavigation)) {
      return true;
    }
    if (nextState.url === authFullRoutingNames.REGISTRATION_FINISHED) {
      return true;
    }
    void swalMesssageExit.fire();
    return this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_LIST], {
      skipLocationChange: false,
    });
  }
}
