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
import { AffiliationService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AffiliationResumeExitGuard
  implements CanDeactivate<ServiceListPage>
{
  constructor(
    private affiliation: AffiliationService,
    private router: Router
  ) {}
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
