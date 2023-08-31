import { Injectable } from '@angular/core';
import { clone, isEmpty } from 'ramda';
import { isNotNil } from 'ramda-adjunct';

import { environment } from '../../../environments/environment';
import { ScriptInjectorService } from './script-injector.service';

export const AdobeEvent = {
  trackFormSubmit: 'trackFormSubmit',
  trackView: 'trackView',
  login: 'Login',
  successLogin: 'successLogin',
  trackAction: 'trackAction',
} as const;

export type AdobeEventType = (typeof AdobeEvent)[keyof typeof AdobeEvent];

interface TrackProperties {
  codruc: string;
  codEmpresa: string;
  codGrupo: string;
  userId: string;
}

export interface Metadata {
  key: string;
  value: string;
}

interface PageEventProperties {
  name: string;
  channel: string;
  url: string;
}

export interface ActionEventProperties {
  category: string;
  action: string;
  label: string;
  detail: string;
  typeElement: string;
  module: string;
  location: string;
  step: string;
  state: string;
  typeError: string;
  metadata: Metadata[];
}

interface TrackEventProperties {
  general: { version: string; platform: string };
  user: {
    codruc: string;
    digitalId: string;
    codEmpresa: string;
    codGrupo: string;
  };
  page?: PageEventProperties;
  action?: Partial<ActionEventProperties>;
  view?: Partial<ActionEventProperties>;
}

interface TrackEvent {
  userId: string;
  path?: string;
  properties: TrackProperties;
  eventProperties: TrackEventProperties;
}

interface Satellite {
  pageBottom(): void;

  track(event: string, payload: Partial<TrackEvent>): void;
}

declare const _satellite: Satellite;

@Injectable({
  providedIn: 'root',
})
export class AdobeAnalyticsService {
  payload: Partial<TrackEvent> = {
    userId: 'Not available',
    properties: {
      userId: 'Not available',
      codEmpresa: 'Not available',
      codGrupo: 'Not available',
      codruc: 'Not available',
    },
    eventProperties: {
      general: {
        version: 'CSX',
        platform: 'Web',
      },
      user: {
        digitalId: 'Not available',
        codEmpresa: 'Not available',
        codGrupo: 'Not available',
        codruc: 'Not available',
      },
    },
  };

  constructor(private scriptInjectorService: ScriptInjectorService) {}

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

  setRuc(ruc: string) {
    if ('undefined' !== typeof ruc && ruc) {
      this.payload.properties.codruc = ruc;
      this.payload.eventProperties.user.codruc = ruc;
    }
  }

  trackEvent(
    event: AdobeEventType,
    eventProperties?: Partial<ActionEventProperties>
  ) {
    const payload = clone(this.payload);
    if (isNotNil(eventProperties)) {
      if (
        event === AdobeEvent.trackFormSubmit ||
        event === AdobeEvent.trackAction
      ) {
        payload.eventProperties.action = eventProperties;
      }
      if (event === AdobeEvent.trackView) {
        payload.eventProperties.view = eventProperties;
      }
    }

    console.log('trackEvent', event, payload);
    if ('undefined' !== typeof _satellite && _satellite) {
      _satellite.track(event, payload);
    }
  }

  pageTrack(path: string) {
    const pathParsed = `cs${path.replace(/\//g, ':')}`;
    this.payload.eventProperties.page = {
      name: pathParsed,
      channel: pathParsed,
      url: location.href,
    };

    const payload = clone(this.payload);

    console.log('pageTrack', payload);
    if ('undefined' !== typeof _satellite && _satellite) {
      _satellite.track('pageTrack', payload);
    }
  }
}
