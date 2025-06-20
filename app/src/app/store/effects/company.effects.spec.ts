import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockProvider } from 'ng-mocks';
import { type Observable } from 'rxjs';

import { CompanyEffects } from './company.effects';

describe('CompanyEffects', () => {
  let actions$: Observable<any>;
  let effects: CompanyEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(CompanyEffects),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(CompanyEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
