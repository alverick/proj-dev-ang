import { inject, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { AffiliationRucGuard } from './affiliation-ruc.guard';

describe('AffiliationRucGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(AffiliationRucGuard)],
    });
  });

  it('should ...', inject(
    [AffiliationRucGuard],
    (guard: AffiliationRucGuard) => {
      void expect(guard).toBeTruthy();
    },
  ));
});
