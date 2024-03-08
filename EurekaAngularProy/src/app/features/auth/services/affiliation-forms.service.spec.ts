import { TestBed } from '@angular/core/testing';

import { AffiliationFormsService } from './affiliation-forms.service';

describe('AffiliationFormsService', () => {
  let service: AffiliationFormsService;
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [AffiliationFormsService] })
  );

  it('should be created', () => {
    service = TestBed.inject(AffiliationFormsService);
    expect(service).toBeTruthy();
  });
});
