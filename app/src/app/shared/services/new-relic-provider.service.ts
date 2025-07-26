import { Injectable } from '@angular/core';
import { type BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';
import dot from 'dot-object';
import { hasPath, path, pathOr } from 'ramda';
import { filter } from 'rxjs/operators';

import { type ProviderService } from './provider.service';
import {
  AdobeEvent,
  type AdobeEventType,
  type Metadata,
  type TrackEventProperties,
  TrackingService,
} from './tracking.service';

declare const window: {
  newrelic: BrowserAgent;
} & Window;

@Injectable()
export class NewRelicProviderService implements ProviderService {
  enabledPageRouting = false;

  constructor(public trackingService: TrackingService) {}

  initNewRelic() {
    const nreum = {
      init: {
        distributed_tracing: { enabled: true },
        privacy: { cookies_enabled: true },
        ajax: { deny_list: ['bam.nr-data.net'] },
      },
      loader_config: {
        accountID: '3805074',
        trustKey: '2487962',
        agentID: '601370524',
        licenseKey: 'NRJS-9ac6e79e9c1a11dc310',
        applicationID: '601370524',
      },
      info: {
        beacon: 'bam.nr-data.net',
        errorBeacon: 'bam.nr-data.net',
        licenseKey: 'NRJS-9ac6e79e9c1a11dc310',
        applicationID: '601370524',
        sa: 1,
      },
    };
    window['NREUM'] = nreum;
  }

  trackPage(payload: Partial<TrackEventProperties>) {
    this.runNewrelic(
      AdobeEvent.pageTrack,
      dot.dot(payload) as Record<string, string>,
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

  startTracking(): void {}

  private runNewrelic(event: string, payload: object) {
    try {
      console.log('runNewrelic', event, payload);
      if ('undefined' !== typeof window.newrelic && window.newrelic) {
        window.newrelic.addPageAction(event, payload);
      }
    } catch (error) {
      console.error('New Relic not loaded', error);
    }
  }
}
