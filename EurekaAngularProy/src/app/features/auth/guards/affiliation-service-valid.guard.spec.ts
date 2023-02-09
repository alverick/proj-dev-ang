import { inject, TestBed, waitForAsync } from '@angular/core/testing';

import { AffiliationServiceValidGuard } from './affiliation-service-valid.guard';

describe('AffiliationServiceValidGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AffiliationServiceValidGuard],
    });
  });

  it('should ...', inject(
    [AffiliationServiceValidGuard],
    (guard: AffiliationServiceValidGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});
