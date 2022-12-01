import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class ValidateTokenGuard implements CanActivate {
  constructor(
    private router: Router,
    private logger: NGXLogger,
    private affiliation: AffiliationService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.affiliation.validateTokenForUpdate(next.params.token).pipe(
      map((result) => {
        if (result) {
          this.router.navigate([authFullRoutingChildNames.UPDATE_COMPANY]);
          return false;
        } else {
          swalAlert.fire({
            title: 'Enlace expirado',
            html: 'El enlace ya ha expirado o ha sido usado, puedes volver a solicitar otro',
          });
          return this.router.parseUrl(authFullRoutingNames.LOGIN);
        }
      })
    );
  }
}
