import { async, inject, TestBed } from '@angular/core/testing';

import { AffiliationUpdateCompanyGuard } from './affiliation-update-company.guard.service';

describe('UpdateCompanyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AffiliationUpdateCompanyGuard],
    });
  });

  it('should ...', inject(
    [AffiliationUpdateCompanyGuard],
    (guard: AffiliationUpdateCompanyGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});
