import { TestBed } from '@angular/core/testing';

import { AffiliationFormsService } from './affiliation-forms.service';

describe('AffiliationFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AffiliationFormsService = TestBed.get(AffiliationFormsService);
    expect(service).toBeTruthy();
  });
});
