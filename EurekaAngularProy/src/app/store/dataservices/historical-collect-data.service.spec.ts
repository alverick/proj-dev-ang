import { TestBed } from '@angular/core/testing';

import { HistoricalCollectDataService } from './historical-collect-data.service';

describe('HistoricalCollectDataService', () => {
  let service: HistoricalCollectDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricalCollectDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
