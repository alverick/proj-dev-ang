import { Injectable } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  type UrlTree,
  Router,
} from '@angular/router';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { swalAlert } from '../../../shared/utils/helpers/popups';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from '../auth-routing.names';
import { AffiliationService } from '../services';

@Injectable()
export class ValidateTokenGuard {
  constructor(
    private router: Router,
    private affiliation: AffiliationService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.affiliation.validateTokenForUpdate(next.params.token).pipe(
      map((result) => {
        if (result) {
          void this.router.navigate([authFullRoutingChildNames.UPDATE_COMPANY]);
          return false;
        } else {
          void swalAlert.fire({
            title: 'Enlace expirado',
            html: 'El enlace ya ha expirado o ha sido usado, puedes volver a solicitar otro',
          });
          return this.router.parseUrl(authFullRoutingNames.LOGIN);
        }
      })
    );
  }
}
