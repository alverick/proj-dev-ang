import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { AppConfigEffects } from './app-config.effects';

describe('AppConfigEffects', () => {
  let actions$: Observable<any>;
  let effects: AppConfigEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppConfigEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(AppConfigEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
