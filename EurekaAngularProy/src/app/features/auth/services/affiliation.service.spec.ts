import { TestBed } from '@angular/core/testing';

import { AffiliationService } from './affiliation.service';

describe('AffiliationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AffiliationService = TestBed.get(AffiliationService);
    expect(service).toBeTruthy();
  });
});
