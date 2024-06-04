import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { isEmpty, pathOr } from 'ramda';
import { isNotEmpty } from 'ramda-adjunct';
import { type Observable, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AppConfigActions } from '../../store/actions/app-config.actions';
import { type ProviderService } from './provider.service';
import { ScriptInjectorService } from './script-injector.service';
import {
  type AdobeEventType,
  type TrackEventProperties,
  AdobeEvent,
  TrackingService,
} from './tracking.service';

export interface Satellite {
  pageBottom(): void;

  track(event: AdobeEventType, payload: Partial<TrackEventProperties>): void;
}

export declare const _satellite: Satellite;

declare const window: {
  _satellite: Satellite;
} & Window;

@Injectable()
export class AdobeLaunchProviderService implements ProviderService {
  launchLibrary: Observable<boolean>;
  loaded = false;

  constructor(
    private scriptInjectorService: ScriptInjectorService,
    public trackingService: TrackingService,
    private store: Store
  ) {
    if (isNotEmpty(environment.adobe)) {
      this.launchLibrary = this.scriptInjectorService
        .loadScript('Launch', environment.adobe)
        .pipe(
          tap(() => {
            if (!this.loaded) {
              this.loaded = true;
              window._satellite.pageBottom();
              this.runSatelliteEvent(AdobeEvent.appInit, {});
            }
          })
        );
    }
    document.addEventListener('at-library-loaded', (event) => {
      console.log('Event', event);
    });
    document.addEventListener('at-request-succeeded', (event) => {
      console.log('Event at-request-succeeded', event);
    });
    document.addEventListener('at-content-rendering-succeeded', (event) => {
      console.log('Event at-content-rendering-succeeded', event);
      this.store.dispatch(AppConfigActions.setLoader({ show: false }));
    });
    document.addEventListener('at-content-rendering-start', (event) => {
      console.log('Event at-content-rendering-start', event);
      this.store.dispatch(AppConfigActions.setLoader({ show: true }));
    });
  }

  trackPage(payload: Partial<TrackEventProperties>) {
    this.runSatelliteEvent(AdobeEvent.pageTrack, payload);
  }

  trackEvent(event: AdobeEventType, payload: Partial<TrackEventProperties>) {
    this.runSatelliteEvent(event, payload);
  }

  private runSatelliteEvent(
    event: AdobeEventType,
    payload: Partial<TrackEventProperties>
  ) {
    try {
      console.log(
        'runSatelliteEvent',
        event,
        payload,
        Date.now(),
        pathOr('nulled', ['adobe', 'target'], window)
      );
      if ('undefined' !== typeof window._satellite && window._satellite) {
        window._satellite.track(event, payload);
      }
    } catch (error) {
      console.error('Adobe Launch not loaded', error);
    }
  }

  startTracking(): void {
    if (isEmpty(environment.adobe)) {
      return;
    }

    combineLatest({
      satellite: this.launchLibrary,
      payload: this.trackingService.eventSubject$,
    }).subscribe(({ payload: { event, payload } }) => {
      this.trackEvent(event, payload);
    });

    combineLatest({
      satellite: this.launchLibrary,
      payload: this.trackingService.pageSubject$,
    }).subscribe(({ payload }) => {
      this.trackPage(payload);
    });
  }
}
