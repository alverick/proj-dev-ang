import { TestBed } from '@angular/core/testing';

import { HotjarProviderService } from './hotjar-provider.service';
import { StorageService } from './storage.service';

describe('HotjarProviderService', () => {
  let service: HotjarProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HotjarProviderService, StorageService],
    });
    service = TestBed.inject(HotjarProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
