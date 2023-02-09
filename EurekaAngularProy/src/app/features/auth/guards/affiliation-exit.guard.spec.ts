import { inject, TestBed, waitForAsync } from '@angular/core/testing';

import { AffiliationExitGuard } from './affiliation-exit.guard';

describe('AffiliationExitGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AffiliationExitGuard],
    });
  });

  it('should ...', inject(
    [AffiliationExitGuard],
    (guard: AffiliationExitGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});
