import { inject, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { ValidateTokenGuard } from './validate-token.guard';

describe('ValidateTokenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(ValidateTokenGuard)],
    });
  });

  it('should ...', inject([ValidateTokenGuard], (guard: ValidateTokenGuard) => {
    void expect(guard).toBeTruthy();
  }));
});
