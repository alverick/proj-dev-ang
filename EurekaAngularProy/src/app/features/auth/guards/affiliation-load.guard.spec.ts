import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { AffiliationLoadGuard } from './affiliation-load.guard';

describe('AffiliationLoadGuard', () => {
  let guard: AffiliationLoadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(AffiliationLoadGuard)],
    });
    guard = TestBed.inject(AffiliationLoadGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });
});
