import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EnterpriseHeadingService } from '../services';

@Injectable()
export class CompanyEntriesResolver {
  constructor(private enterpriseHeading: EnterpriseHeadingService) {}

  resolve() {
    return this.enterpriseHeading.getEntryOptions().pipe(
      catchError(() => {
        return of('No data');
      })
    );
  }
}
