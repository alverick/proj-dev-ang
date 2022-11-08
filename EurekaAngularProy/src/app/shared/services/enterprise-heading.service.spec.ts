import { TestBed } from '@angular/core/testing';

import { EnterpriseHeadingService } from './enterprise-heading.service';

describe('EnterpriseHeadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnterpriseHeadingService = TestBed.get(
      EnterpriseHeadingService
    );
    expect(service).toBeTruthy();
  });
});
