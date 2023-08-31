import { TestBed } from '@angular/core/testing';

import { AdobeAnalyticsService } from './adobe-analytics.service';

describe('AdobeAnalyticsService', () => {
  let service: AdobeAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdobeAnalyticsService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
