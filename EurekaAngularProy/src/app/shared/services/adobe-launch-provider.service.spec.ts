import { TestBed } from '@angular/core/testing';

import { AdobeLaunchProviderService } from './adobe-launch-provider.service';

describe('AdobeLaunchProviderService', () => {
  let service: AdobeLaunchProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdobeLaunchProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
