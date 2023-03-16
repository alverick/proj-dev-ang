import { TestBed } from '@angular/core/testing';

import { ServiceService } from './service.service';

describe('ServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceService = TestBed.get(ServiceService);
    expect(service).toBeTruthy();
  });
});
