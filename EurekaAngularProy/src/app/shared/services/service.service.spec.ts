import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { ServiceService } from './service.service';

describe('ServicesService', () => {
  let service: ServiceService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(ServiceService)],
    });
    service = TestBed.inject(ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
