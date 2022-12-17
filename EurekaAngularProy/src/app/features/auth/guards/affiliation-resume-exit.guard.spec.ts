import { inject, TestBed, waitForAsync } from '@angular/core/testing';

import { AffiliationResumeExitGuard } from './affiliation-resume-exit.guard';

describe('AffiliationResumeExitGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AffiliationResumeExitGuard],
    });
  });

  it('should ...', inject(
    [AffiliationResumeExitGuard],
    (guard: AffiliationResumeExitGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});
