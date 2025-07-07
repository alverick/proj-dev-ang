import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { DigitalDataService } from './digital-data.service';

describe('DigitalDataService', () => {
  let service: DigitalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(DigitalDataService)],
    });
    service = TestBed.inject(DigitalDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
