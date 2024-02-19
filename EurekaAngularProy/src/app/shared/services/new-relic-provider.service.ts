import { Injectable } from '@angular/core';
import { type BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';
import dot from 'dot-object';
import { filter } from 'rxjs/operators';

import { type ProviderService } from './provider.service';
import {
  type AdobeEventType,
  type TrackEventProperties,
  AdobeEvent,
  TrackingService,
} from './tracking.service';

declare const window: {
  newrelic: BrowserAgent;
} & Window;

@Injectable()
export class NewRelicProviderService implements ProviderService {
  enabledPageRouting = false;

  constructor(public trackingService: TrackingService) {}

  trackPage(payload: Partial<TrackEventProperties>) {
    window.newrelic.addPageAction(
      AdobeEvent.pageTrack,
      dot.dot(payload) as Record<string, string>
    );
  }

  trackEvent(event: AdobeEventType, payload: Partial<TrackEventProperties>) {
    window.newrelic.addPageAction(
      event,
      dot.dot(payload) as Record<string, string>
    );
  }

  startTracking(): void {
    this.trackingService.eventSubject$
      .pipe(
        filter(
          ({ event, payload }) =>
            event === AdobeEvent.trackFormSubmit &&
            payload.page.module === 'Afiliación'
        )
      )
      .subscribe(({ event, payload }) => {
        console.log('trackingService.eventSubject$', event);
        this.trackEvent(event, payload);
      });
    this.trackingService.pageSubject$
      .pipe(filter(() => this.enabledPageRouting))
      .subscribe((payload) => this.trackPage(payload));
  }
}
