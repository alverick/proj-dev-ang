import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { CompanyConfigurationService } from './company-configuration.service';

describe('CompanyConfigurationService', () => {
  let service: CompanyConfigurationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(CompanyConfigurationService)],
    });
    service = TestBed.inject(CompanyConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
