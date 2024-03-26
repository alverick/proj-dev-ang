import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { EnterpriseHeadingService } from './enterprise-heading.service';

describe('EnterpriseHeadingService', () => {
  let service: EnterpriseHeadingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(EnterpriseHeadingService)],
    });
    service = TestBed.inject(EnterpriseHeadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
