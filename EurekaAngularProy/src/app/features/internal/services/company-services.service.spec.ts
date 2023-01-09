import { TestBed } from '@angular/core/testing';

import { CompanyServicesService } from './company-services.service';

describe('CompanyServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyServicesService = TestBed.get(CompanyServicesService);
    expect(service).toBeTruthy();
  });
});
