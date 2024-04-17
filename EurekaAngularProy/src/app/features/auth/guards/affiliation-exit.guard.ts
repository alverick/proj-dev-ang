import { Injectable } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  type CanDeactivate,
  type RouterStateSnapshot,
  type UrlTree,
} from '@angular/router';
import { type Observable } from 'rxjs';

import { authFullRoutingNames } from '../auth-routing.names';
import { swalMesssageExit } from '../constants';
import { type ServiceAddPage } from '../pages/service-add/service-add.page';

@Injectable()
export class AffiliationExitGuard implements CanDeactivate<ServiceAddPage> {
  canDeactivate(
    component: ServiceAddPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (nextState.url === authFullRoutingNames.REGISTRATION_FINISHED) {
      return true;
    }
    swalMesssageExit.fire();
    return false;
  }
}
