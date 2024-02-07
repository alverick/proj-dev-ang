import { Injectable } from '@angular/core';
import { type Resolve } from '@angular/router';
import { type Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { type IEntryModel } from '../models';
import { EnterpriseHeadingService } from '../services';

@Injectable()
export class CompanyEntriesResolver implements Resolve<IEntryModel[] | string> {
  constructor(private enterpriseHeading: EnterpriseHeadingService) {}

  resolve(): Observable<IEntryModel[] | string> {
    return this.enterpriseHeading.getEntryOptions().pipe(
      catchError(() => {
        return of('No data');
      })
    );
  }
}
