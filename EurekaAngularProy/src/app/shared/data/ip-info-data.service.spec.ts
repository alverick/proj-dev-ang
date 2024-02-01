import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { IpInfoDataService } from './ip-info-data.service';

describe('QueryDataService', () => {
  let service: IpInfoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [IpInfoDataService],
    });
    service = TestBed.inject(IpInfoDataService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('get ip info', (done) => {
    service.getIpInfo().subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });
});
