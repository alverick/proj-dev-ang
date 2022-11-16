import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../auth-routing.names';
import { ServiceListPage } from '../pages/service-list/service-list.page';

@Injectable()
export class AffiliationResumeExitGuard
  implements CanDeactivate<ServiceListPage>
{
  constructor(private router: Router) {}
  canDeactivate(
    component: ServiceListPage,
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
    return this.router.navigate([authFullRoutingChildNames.SERVICES_ADD_LIST], {
      skipLocationChange: false,
    });
  }
}
