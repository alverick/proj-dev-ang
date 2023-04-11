import { TestBed } from '@angular/core/testing';

import { CollectAmountDataService } from './collect-amount-data.service';

describe('CollectAmountDataService', () => {
  let service: CollectAmountDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectAmountDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
