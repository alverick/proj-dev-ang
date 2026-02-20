import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CompanyService } from '../../../shared/services';

@Injectable()
export class CompanyDataResolver {
  private readonly companyService = inject(CompanyService);

  resolve() {
    return this.companyService.getCompanyData().pipe(
      catchError(() => {
        return of('No data');
      }),
    );
  }
}
