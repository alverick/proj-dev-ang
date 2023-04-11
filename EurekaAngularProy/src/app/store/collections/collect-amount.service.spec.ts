import { TestBed } from '@angular/core/testing';

import { CollectAmountService } from './collect-amount.service';

describe('CollectAmountService', () => {
  let service: CollectAmountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectAmountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
