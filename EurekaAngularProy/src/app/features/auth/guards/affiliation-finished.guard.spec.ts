import { TestBed, async, inject } from '@angular/core/testing';

import { AffiliationFinishedGuard } from './affiliation-finished.guard';

describe('AffiliationFinishedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AffiliationFinishedGuard]
    });
  });

  it('should ...', inject([AffiliationFinishedGuard], (guard: AffiliationFinishedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
