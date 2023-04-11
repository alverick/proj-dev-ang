import { TestBed } from '@angular/core/testing';

import { HistoricalCollectService } from './historical-collect.service';

describe('HistoricalCollectService', () => {
  let service: HistoricalCollectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricalCollectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
