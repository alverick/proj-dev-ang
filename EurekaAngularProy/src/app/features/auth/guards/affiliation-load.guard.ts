import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { type Observable } from 'rxjs';

import { appConfigFeature } from '../../../store/reducers/app-config.reducer';

@Injectable()
export class AffiliationLoadGuard {
  constructor(private store: Store, private route: Router) {}

  canMatch(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.store
        .select(appConfigFeature.selectDisabledAffiliation)
        .subscribe((disabledAffiliation) => resolve(!disabledAffiliation));
    });
  }
}
