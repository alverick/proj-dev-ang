import { TestBed } from '@angular/core/testing';

import { TopClientDataService } from './top-client-data.service';

describe('TopClientDataService', () => {
  let service: TopClientDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopClientDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
