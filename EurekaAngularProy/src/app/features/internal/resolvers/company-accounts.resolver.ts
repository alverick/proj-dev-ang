import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CompanyService } from '../../../shared/services';

@Injectable()
export class CompanyAccountsResolver implements Resolve<any> {
  constructor(private companyService: CompanyService) {}
  resolve(): Observable<any> {
    return this.companyService.getCompanyAccounts().pipe(
      tap((result) => {
        console.log('accounts', result);
      }),
      catchError(() => {
        return of('No data');
      })
    );
  }
}
