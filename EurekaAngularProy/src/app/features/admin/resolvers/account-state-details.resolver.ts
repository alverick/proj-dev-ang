import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IAccountStateDetails } from 'src/app/shared/models/company';
import { CompanyService } from '../../../shared/services';

@Injectable()
export class AccountStateDetailsResolver implements Resolve<any> {
  constructor(private companyService: CompanyService) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IAccountStateDetails | string> {
    return this.companyService.getAccountStateDetails(route.params.llave).pipe(
      catchError(() => {
        return of('No data');
      })
    );
  }
}
