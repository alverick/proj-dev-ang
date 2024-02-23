import { Injectable } from '@angular/core';
import { isEmpty } from 'ramda';

import { environment } from '../../../environments/environment';
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

@Injectable()
export class AdobeLaunchProviderService implements ProviderService {
  constructor(
    private scriptInjectorService: ScriptInjectorService,
    public trackingService: TrackingService
  ) {
    void this.injectAdobeLaunchScript();
  }

  async injectAdobeLaunchScript() {
    if (isEmpty(environment.adobe)) {
      return;
    }
    try {
      await this.scriptInjectorService.load('Launch', environment.adobe);
      _satellite.pageBottom();
    } catch (e) {
      console.error('Error while loading Adobe Launch script', e);
    }
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
      if ('undefined' !== typeof _satellite && _satellite) {
        _satellite.track(event, payload);
      }
    } catch (error) {
      console.error('Adobe Launch not loaded', error);
    }
  }

  startTracking(): void {
    this.trackingService.eventSubject$.subscribe(({ event, payload }) => {
      this.trackEvent(event, payload);
    });
    this.trackingService.pageSubject$.subscribe((payload) =>
      this.trackPage(payload)
    );
  }
}
