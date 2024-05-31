import { Injectable } from '@angular/core';
import { type RouterStateSnapshot, type UrlTree } from '@angular/router';
import { type Observable } from 'rxjs';

import { authFullRoutingNames } from '../auth-routing.names';
import { swalMesssageExit } from '../constants';

@Injectable()
export class AffiliationExitGuard {
  canDeactivate(
    nextState: RouterStateSnapshot
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
