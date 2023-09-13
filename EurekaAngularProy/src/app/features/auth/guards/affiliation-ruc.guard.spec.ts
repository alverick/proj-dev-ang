import { inject, TestBed } from '@angular/core/testing';

import { AffiliationRucGuard } from './affiliation-ruc.guard';

describe('AffiliationRucGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AffiliationRucGuard],
    });
  });

  it('should ...', inject(
    [AffiliationRucGuard],
    (guard: AffiliationRucGuard) => {
      void expect(guard).toBeTruthy();
    }
  ));
});
