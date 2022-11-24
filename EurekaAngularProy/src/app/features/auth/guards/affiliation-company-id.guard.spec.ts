import { async, inject, TestBed } from '@angular/core/testing';

import { AffiliationCompanyIdGuard } from './affiliation-company-id.guard';

describe('AffiliationCompanyIdGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AffiliationCompanyIdGuard],
    });
  });

  it('should ...', inject(
    [AffiliationCompanyIdGuard],
    (guard: AffiliationCompanyIdGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});
