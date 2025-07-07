import { Injectable } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  Router,
  type RouterStateSnapshot,
  type UrlTree,
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
  constructor(private readonly router: Router) {}
  canDeactivate(
    _component: ServiceResumePage,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentNavigation = this.router.getCurrentNavigation();
    if (pathEq(true, ['extras', 'state', 'navigateValid'], currentNavigation)) {
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
