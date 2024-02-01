import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { IpInfoDataService } from '../data';
import { DigitalDataService } from './digital-data.service';

describe('DigitalDataService', () => {
  let service: DigitalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [IpInfoDataService, DigitalDataService],
    });
    service = TestBed.inject(DigitalDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
