import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { TopClientService } from './top-client.service';

describe('TopClientService', () => {
  let service: TopClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(TopClientService)],
    });
    service = TestBed.inject(TopClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
