import { Injectable } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
  type UrlTree,
} from '@angular/router';
import { type Observable } from 'rxjs';

import { authFullRoutingNames } from '../auth-routing.names';
import { swalMesssageExit } from '../constants';
import { type ServiceAddPage } from '../pages';

@Injectable()
export class AffiliationExitGuard {
  canDeactivate(
    _component: ServiceAddPage,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (nextState.url === authFullRoutingNames.REGISTRATION_FINISHED) {
      return true;
    }
    void swalMesssageExit.fire();
    return false;
  }
}
