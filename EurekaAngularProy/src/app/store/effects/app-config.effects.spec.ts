import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockProvider } from "ng-mocks";
import { type Observable } from 'rxjs';

import { AppConfigEffects } from './app-config.effects';

describe('AppConfigEffects', () => {
  let actions$: Observable<any>;
  let effects: AppConfigEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(AppConfigEffects),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(AppConfigEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
