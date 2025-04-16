import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { MovementsService } from './movements.service';

describe('MovementsService', () => {
  let service: MovementsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(MovementsService)],
    });
    service = TestBed.inject(MovementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
