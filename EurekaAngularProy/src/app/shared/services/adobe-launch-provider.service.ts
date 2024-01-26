import { Injectable } from '@angular/core';
import { clone, isEmpty } from 'ramda';
import { isNotNil } from 'ramda-adjunct';

import { environment } from '../../../environments/environment';
import { ScriptInjectorService } from './script-injector.service';
import {
  type ActionEventProperties,
  type AdobeEventType,
  type TrackEventProperties,
  AdobeEvent,
  TrackingService,
} from './tracking.service';

interface Satellite {
  pageBottom(): void;

  track(event: AdobeEventType, payload: Partial<TrackEventProperties>): void;
}

export declare const _satellite: Satellite;

@Injectable({
  providedIn: 'root',
})
export class AdobeLaunchProviderService {
  constructor(
    private scriptInjectorService: ScriptInjectorService,
    protected trackingService: TrackingService
  ) {
    void this.injectAdobeLaunchScript();
    trackingService.eventSubject$.subscribe(
      ({ event, eventProperties, payload }) =>
        this.trackEvent(event, eventProperties, payload)
    );
    trackingService.pageSubject$.subscribe((payload) =>
      this.trackPage(payload)
    );
  }

  async injectAdobeLaunchScript() {
    if (isEmpty(environment.adobe)) {
      return;
    }
    try {
      console.log('loaded adobe');
      await this.scriptInjectorService.load('Launch', environment.adobe);
      _satellite.pageBottom();
    } catch (e) {
      console.error('Error while loading Adobe Launch script', e);
    }
  }

  trackPage(payload: Partial<TrackEventProperties>) {
    this.runSatelliteEvent(AdobeEvent.pageTrack, payload);
  }

  trackEvent(
    event: AdobeEventType,
    eventProperties: Partial<ActionEventProperties>,
    payloadInit: Partial<TrackEventProperties>
  ) {
    const payload = clone(payloadInit);
    if (isNotNil(eventProperties)) {
      if (
        event === AdobeEvent.trackFormSubmit ||
        event === AdobeEvent.login ||
        event === AdobeEvent.trackAction
      ) {
        payload.action = eventProperties;
      }
      if (event === AdobeEvent.trackView) {
        payload.view = eventProperties;
      }
    }
    this.runSatelliteEvent(event, payload);
    // if (payload.page.module === 'Afiliación') {
    //   const isObject = (x) => Object(x) === x;
    //   // flatten object
    //   const oflatten = (data) => {
    //     const loop = (
    //       namespace,
    //       acc: Record<string, string | boolean | number>,
    //       data
    //     ): Record<string, string | boolean | number> => {
    //       if (Array.isArray(data))
    //         data.forEach((v, k) => loop(namespace.concat([k]), acc, v));
    //       else if (isObject(data))
    //         Object.keys(data).forEach((k) =>
    //           loop(namespace.concat([k]), acc, data[k])
    //         );
    //       else Object.assign(acc, { [namespace.join('.')]: data });
    //       return acc;
    //     };
    //     return loop([], {}, data);
    //   };
    //   console.log('flujo Afiliación', event, oflatten(payload));
    //   // BrowserAgent.addPageAction
    //   newrelic.addPageAction(
    //     event,
    //     oflatten(payload) as Record<string, string>
    //   );
    // }
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
}
