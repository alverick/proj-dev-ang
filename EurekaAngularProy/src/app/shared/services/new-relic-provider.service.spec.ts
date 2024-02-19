import { TestBed } from '@angular/core/testing';

import { NewRelicProviderService } from './new-relic-provider.service';

describe('NewRelicProviderService', () => {
  let service: NewRelicProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewRelicProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
