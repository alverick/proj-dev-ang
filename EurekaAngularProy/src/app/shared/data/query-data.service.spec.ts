import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { QueryDataService } from './query-data.service';

describe('QueryDataService', () => {
  let service: QueryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QueryDataService],
    });
    service = TestBed.inject(QueryDataService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
