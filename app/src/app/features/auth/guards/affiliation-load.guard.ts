import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { type Observable } from 'rxjs';

import { appConfigFeature } from '../../../store/reducers/app-config.reducer';

@Injectable()
export class AffiliationLoadGuard {
  private readonly store = inject(Store);

  canMatch(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.store
        .select(appConfigFeature.selectDisabledAffiliation)
        .subscribe((disabledAffiliation) => resolve(!disabledAffiliation));
    });
  }
}
