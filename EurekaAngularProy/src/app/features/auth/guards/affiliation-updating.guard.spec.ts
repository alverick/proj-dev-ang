import { TestBed } from '@angular/core/testing';

import { AffiliationUpdatingGuard } from './affiliation-updating.guard';

describe('AffiliationUpdatingGuard', () => {
  let guard: AffiliationUpdatingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AffiliationUpdatingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
