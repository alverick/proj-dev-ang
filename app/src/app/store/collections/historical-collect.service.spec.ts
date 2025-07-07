import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { HistoricalCollectService } from './historical-collect.service';

describe('HistoricalCollectService', () => {
  let service: HistoricalCollectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(HistoricalCollectService)],
    });
    service = TestBed.inject(HistoricalCollectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
