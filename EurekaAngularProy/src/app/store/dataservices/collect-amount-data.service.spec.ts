import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { CollectAmountDataService } from './collect-amount-data.service';

describe('CollectAmountDataService', () => {
  let service: CollectAmountDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(CollectAmountDataService)],
    });
    service = TestBed.inject(CollectAmountDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
