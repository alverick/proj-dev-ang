import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EnterpriseHeadingService } from '../services';
import { CompanyConfigurationService } from '../services';

@Injectable()
export class CompanyEntriesResolver implements Resolve<any> {
  constructor(
    private enterpriseHeading: EnterpriseHeadingService,
    private companyConfiguration: CompanyConfigurationService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.enterpriseHeading.getEntryOptions().pipe(
      tap((result) => {
        this.companyConfiguration.entryOptionsAdd = result;
      }),
      catchError(() => {
        return of('No data');
      })
    );
  }
}
