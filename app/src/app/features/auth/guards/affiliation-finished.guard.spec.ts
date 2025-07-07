import { inject, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { AffiliationFinishedGuard } from './affiliation-finished.guard';

describe('AffiliationFinishedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(AffiliationFinishedGuard)],
    });
  });

  it('should ...', inject(
    [AffiliationFinishedGuard],
    (guard: AffiliationFinishedGuard) => {
      void expect(guard).toBeTruthy();
    },
  ));
});
