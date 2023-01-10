import { TestBed } from '@angular/core/testing';

import { CompanyConfigurationService } from './company-configuration.service';

describe('CompanyConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyConfigurationService = TestBed.get(
      CompanyConfigurationService
    );
    expect(service).toBeTruthy();
  });
});
