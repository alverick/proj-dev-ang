import { TestBed } from '@angular/core/testing';

import { ServicesFormsService } from './services-forms.service';

describe('ServiceFormsService', () => {
  let service: ServicesFormsService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ServicesFormsService] });
    service = TestBed.inject(ServicesFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
