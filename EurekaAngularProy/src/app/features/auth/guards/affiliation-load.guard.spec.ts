import { TestBed } from '@angular/core/testing';

import { AffiliationLoadGuard } from './affiliation-load.guard';

describe('AffiliationLoadGuard', () => {
  let guard: AffiliationLoadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AffiliationLoadGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });
});
