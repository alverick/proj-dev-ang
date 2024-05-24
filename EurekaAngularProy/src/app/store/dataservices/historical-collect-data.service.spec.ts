import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { HistoricalCollectDataService } from './historical-collect-data.service';

describe('HistoricalCollectDataService', () => {
  let service: HistoricalCollectDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(HistoricalCollectDataService)],
    });
    service = TestBed.inject(HistoricalCollectDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
