import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CompanyService } from '../../../shared/services';

@Injectable()
export class CompanyAccountsResolver implements Resolve<any> {
  constructor(private companyService: CompanyService) {}
  resolve(): Observable<any> {
    return this.companyService.getCompanyAccounts().pipe(
      catchError(() => {
        return of('No data');
      })
    );
  }
}
