import { TestBed } from '@angular/core/testing';

import { RecaptchaProviderService } from './recaptcha-provider.service';
import { ScriptInjectorService } from './script-injector.service';

describe('RecaptchaServiceService', () => {
  let service: RecaptchaProviderService;

  beforeEach(() => {
    const scriptInjectorServiceMock = {
      loadScript: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        RecaptchaProviderService,
        { provide: ScriptInjectorService, useValue: scriptInjectorServiceMock },
      ],
    });
    service = TestBed.inject(RecaptchaProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
