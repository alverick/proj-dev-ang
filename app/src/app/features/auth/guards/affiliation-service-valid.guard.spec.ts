import { inject, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { AffiliationServiceValidGuard } from './affiliation-service-valid.guard';

describe('AffiliationServiceValidGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(AffiliationServiceValidGuard)],
    });
  });

  it('should ...', inject(
    [AffiliationServiceValidGuard],
    (guard: AffiliationServiceValidGuard) => {
      void expect(guard).toBeTruthy();
    },
  ));
});
