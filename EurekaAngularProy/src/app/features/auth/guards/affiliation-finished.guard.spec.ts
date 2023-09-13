import { inject, TestBed } from '@angular/core/testing';

import { AffiliationFinishedGuard } from './affiliation-finished.guard';

describe('AffiliationFinishedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AffiliationFinishedGuard],
    });
  });

  it('should ...', inject(
    [AffiliationFinishedGuard],
    (guard: AffiliationFinishedGuard) => {
      void expect(guard).toBeTruthy();
    }
  ));
});
