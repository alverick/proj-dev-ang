import { Injectable } from '@angular/core';
import { type ActivatedRouteSnapshot } from '@angular/router';
import { type Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { type IAccountStateDetails } from '../../../shared/models/company';
import { CompanyService } from '../../../shared/services';

@Injectable()
export class AccountStateDetailsResolver {
  constructor(private readonly companyService: CompanyService) {}

  resolve(
    route: ActivatedRouteSnapshot,
  ): Observable<IAccountStateDetails | string> {
    const accountKey = route.params['llave'] as string;

    if (!accountKey) {
      return of('Invalid account key');
    }

    return this.companyService.getAccountStateDetails(accountKey).pipe(
      catchError(() => {
        return of('Failed to load account state details');
      }),
    );
  }
}
