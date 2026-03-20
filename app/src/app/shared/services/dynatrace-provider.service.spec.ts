import { TestBed } from '@angular/core/testing';

import { DynatraceProviderService } from './dynatrace-provider.service';

describe('DynatraceProviderService', () => {
  let service: DynatraceProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynatraceProviderService],
    });
    service = TestBed.inject(DynatraceProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
