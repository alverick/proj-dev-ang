import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceAddPage } from '../pages/service-add/service-add.page';
import { AffiliationService } from '../services';

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
    console.log('no salir');
    return true;
  }
}
