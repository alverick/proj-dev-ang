import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { pathEq } from 'ramda';
import { Observable } from 'rxjs';

import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../auth-routing.names';
import { swalMesssageExit } from '../constants';
import { ServiceResumePage } from '../pages/service-resume/service-resume.page';

@Injectable()
export class AffiliationResumeExitGuard
  implements CanDeactivate<ServiceResumePage>
{
  constructor(private router: Router) {}
  canDeactivate(
    component: ServiceResumePage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
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
