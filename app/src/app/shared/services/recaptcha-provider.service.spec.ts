import { TestBed } from '@angular/core/testing';

import { RecaptchaProviderService } from './recaptcha-provider.service';

describe('RecaptchaServiceService', () => {
  let service: RecaptchaProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecaptchaProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
