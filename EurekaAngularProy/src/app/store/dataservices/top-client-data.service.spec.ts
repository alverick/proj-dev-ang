import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { TopClientDataService } from './top-client-data.service';

describe('TopClientDataService', () => {
  let service: TopClientDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(TopClientDataService)],
    });
    service = TestBed.inject(TopClientDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
