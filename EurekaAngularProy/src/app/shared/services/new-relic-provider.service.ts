import { Injectable } from '@angular/core';
import { type BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';
import dot from 'dot-object';
import { hasPath, path, pathOr } from 'ramda';
import { filter } from 'rxjs/operators';

import { type ProviderService } from './provider.service';
import {
  type AdobeEventType,
  type Metadata,
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
    this.runNewrelic(
      AdobeEvent.pageTrack,
      dot.dot(payload) as Record<string, string>
    );
  }

  trackEvent(event: AdobeEventType, payload: Partial<TrackEventProperties>) {
    let data: Record<string, unknown>;
    const rawdataPath = ['action', 'rawMetadata', 'newrelic'];
    if (hasPath(rawdataPath, payload)) {
      data = path(rawdataPath, payload);
    } else {
      const metadata = pathOr<Metadata[]>([], ['action', 'metadata'], payload);
      data = Object.fromEntries(metadata.map((meta) => [meta.key, meta.value]));
    }
    this.runNewrelic(event, {
      ...data,
      state: payload.action.state,
      typeError: payload.action.typeError,
    });
  }

  startTracking(): void {
    this.trackingService.eventSubject$
      .pipe(
        filter(
          ({ event, payload }) =>
            event === AdobeEvent.trackFormSubmit &&
            (payload.action.step === 'Step2' ||
              payload.action.step === 'Step5') &&
            payload.page.module === 'Afiliación'
        )
      )
      .subscribe(({ event, payload }) => {
        this.trackEvent(event, payload);
      });

    this.trackingService.pageSubject$
      .pipe(filter(() => this.enabledPageRouting))
      .subscribe((payload) => this.trackPage(payload));
  }

  private runNewrelic(event: string, payload: object) {
    try {
      if ('undefined' !== typeof window.newrelic && window.newrelic) {
        window.newrelic.addPageAction(event, payload);
      }
    } catch (error) {
      console.error('New Relic not loaded', error);
    }
  }
}
