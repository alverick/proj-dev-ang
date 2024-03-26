import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { CompanyServicesService } from './company-services.service';

describe('CompanyServicesService', () => {
  let service: CompanyServicesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(CompanyServicesService)],
    });
    service = TestBed.inject(CompanyServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
