import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { CollectAmountService } from './collect-amount.service';

describe('CollectAmountService', () => {
  let service: CollectAmountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(CollectAmountService)],
    });
    service = TestBed.inject(CollectAmountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
