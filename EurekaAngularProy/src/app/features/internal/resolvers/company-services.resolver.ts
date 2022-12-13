import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CompanyService } from '../../../shared/services';

@Injectable()
export class CompanyServicesResolver implements Resolve<any> {
  constructor(private companyService: CompanyService) {}
  resolve(): Observable<any> {
    return this.companyService.getCompanyServices().pipe(
      catchError(() => {
        return of('No data');
      })
    );
  }
}
