import { TestBed } from '@angular/core/testing';

import { ServicesFormsService } from './services-forms.service';

describe('ServiceFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicesFormsService = TestBed.get(ServicesFormsService);
    expect(service).toBeTruthy();
  });
});
