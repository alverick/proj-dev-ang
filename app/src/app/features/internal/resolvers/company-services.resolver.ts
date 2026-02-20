import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CompanyService } from '../../../shared/services';

@Injectable()
export class CompanyServicesResolver {
  private readonly companyService = inject(CompanyService);

  resolve() {
    return this.companyService.getCompanyServices().pipe(
      catchError(() => {
        return of('No data');
      }),
    );
  }
}
