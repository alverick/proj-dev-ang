import { TestBed } from '@angular/core/testing';

import { DebtDataService } from './debt-data.service';

describe('DebtDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DebtDataService = TestBed.get(DebtDataService);
    expect(service).toBeTruthy();
  });
});
