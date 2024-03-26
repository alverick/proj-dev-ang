import { Injectable } from '@angular/core';
import { type ActivatedRouteSnapshot, type Resolve } from '@angular/router';
import { type Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { type IAccountStateDetails } from '../../../shared/models/company';
import { CompanyService } from '../../../shared/services';

@Injectable()
export class AccountStateDetailsResolver implements Resolve<any> {
  constructor(private companyService: CompanyService) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IAccountStateDetails | string> {
    return this.companyService
      .getAccountStateDetails(route.params.llave as string)
      .pipe(
        catchError(() => {
          return of('No data');
        })
      );
  }
}
