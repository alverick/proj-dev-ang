import { inject, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { AffiliationCompanyIdGuard } from './affiliation-company-id.guard';

describe('AffiliationCompanyIdGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(AffiliationCompanyIdGuard)],
    });
  });

  it('should ...', inject(
    [AffiliationCompanyIdGuard],
    (guard: AffiliationCompanyIdGuard) => {
      void expect(guard).toBeTruthy();
    }
  ));
});
