import { TestBed } from '@angular/core/testing';

import { TopClientService } from './top-client.service';

describe('TopClientService', () => {
  let service: TopClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
