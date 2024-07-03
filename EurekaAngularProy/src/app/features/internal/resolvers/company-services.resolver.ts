import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CompanyService } from '../../../shared/services';

@Injectable()
export class CompanyServicesResolver {
  constructor(private companyService: CompanyService) {}
  resolve() {
    return this.companyService.getCompanyServices().pipe(
      catchError(() => {
        return of('No data');
      })
    );
  }
}
