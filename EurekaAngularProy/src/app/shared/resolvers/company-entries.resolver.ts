import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

import { EnterpriseHeadingService } from '../services';

@Injectable()
export class CompanyEntriesResolver {
  constructor(private enterpriseHeading: EnterpriseHeadingService) {}

  resolve() {
    return this.enterpriseHeading
      .getEntryOptions()
      .pipe(catchError(() => 'No data'));
  }
}
