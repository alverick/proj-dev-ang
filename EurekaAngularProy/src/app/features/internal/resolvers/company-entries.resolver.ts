import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnterpriseHeadingService } from '../../../shared/services/enterprise-heading.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyEntriesResolver implements Resolve<any> {
  constructor(private enterpriseHeading: EnterpriseHeadingService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.enterpriseHeading.getEntryOptions().pipe(
      catchError(() => {
        return of('No data');
      })
    );
  }
}
