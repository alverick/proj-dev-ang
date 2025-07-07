import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DebtDataService } from './debt-data.service';

describe('DebtDataService', () => {
  let service: DebtDataService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DebtDataService],
    });
    service = TestBed.inject(DebtDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
