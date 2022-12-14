import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CompanyService } from '../../../shared/services/company.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyDataResolver implements Resolve<any> {
  constructor(private companyService: CompanyService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.companyService.getCompanyData().pipe(
      catchError(() => {
        return of('No data');
      })
    );
  }
}
