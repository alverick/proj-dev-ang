import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { AffiliationUpdatingGuard } from './affiliation-updating.guard';

describe('AffiliationUpdatingGuard', () => {
  let guard: AffiliationUpdatingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(AffiliationUpdatingGuard)],
    });
    guard = TestBed.inject(AffiliationUpdatingGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });
});
