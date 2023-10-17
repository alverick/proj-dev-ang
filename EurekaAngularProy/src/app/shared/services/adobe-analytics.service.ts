import { Injectable } from '@angular/core';
import { clone, isEmpty } from 'ramda';
import { isNotNil } from 'ramda-adjunct';

import { environment } from '../../../environments/environment';
import {
  appFullRoutingNames,
  authFullRoutingNames,
  internalFullRoutingNames,
} from '../../app-routing.collection';
import { ScriptInjectorService } from './script-injector.service';
import { StorageService } from './storage.service';

export const AdobeEvent = {
  trackFormSubmit: 'trackFormSubmit',
  trackView: 'trackView',
  login: 'Login',
  successLogin: 'successLogin',
  trackAction: 'trackAction',
  pageTrack: 'pageTrack',
} as const;

export type AdobeEventType = (typeof AdobeEvent)[keyof typeof AdobeEvent];

export interface Metadata {
  key: string;
  value: string | boolean;
}

interface PageEventProperties {
  name: string;
  channel: string;
  module: string;
  url: string;
}

export interface ActionEventProperties {
  category: string;
  action: string;
  label: string;
  detail: string;
  typeElement: string;
  location: string;
  step: string;
  state: string;
  typeError: string;
  metadata: Metadata[];
}

interface TrackEventProperties {
  general: { version: string; platform: string };
  user: {
    codRuc: string;
    userId: string;
    digitalId: string;
    codEmpresa: string;
    codGrupo: string;
  };
  page?: PageEventProperties;
  action?: Partial<ActionEventProperties>;
  view?: Partial<ActionEventProperties>;
}

interface Satellite {
  pageBottom(): void;

  track(event: AdobeEventType, payload: Partial<TrackEventProperties>): void;
}

declare const _satellite: Satellite;

@Injectable({
  providedIn: 'root',
})
export class AdobeAnalyticsService {
  payload: Partial<TrackEventProperties> = {
    general: {
      version: 'CSX',
      platform: 'Web',
    },
    user: {
      userId: 'Not available',
      digitalId: 'Not available',
      codEmpresa: 'Not available',
      codGrupo: 'Not available',
      codRuc: 'Not available',
    },
  };

  constructor(
    private scriptInjectorService: ScriptInjectorService,
    private storageService: StorageService
  ) {
    const session = this.storageService.getCurrentSession();
    if (session && session.isAuthenticate) {
      this.setRuc(window.sessionStorage.getItem('username'));
    }
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

  setRuc(ruc: string) {
    if ('undefined' !== typeof ruc && ruc) {
      this.payload.user.codRuc = ruc;
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
  }

  pageTrack(path: string) {
    const pathComp = path.startsWith(authFullRoutingNames.CHANGE_PASSWORD)
      ? authFullRoutingNames.CHANGE_PASSWORD
      : path;
    const pathParsed = `cs${pathComp.replace(/\//g, ':')}`;
    this.payload.page = {
      name: pathParsed,
      channel: pathParsed,
      module: this.parseModule(path),
      url: `${location.protocol}//${location.host}${pathComp}`,
    };

    const payload = clone(this.payload);

    this.runSatelliteEvent(AdobeEvent.pageTrack, payload);
  }

  parseModule(url: string) {
    const routes: Record<string, string> = {
      [internalFullRoutingNames.HELP]: 'Ayuda',
      [internalFullRoutingNames.HOME]: 'Home',
      [internalFullRoutingNames.COMPANY]: 'ConfiguracionEmpresa',
      [internalFullRoutingNames.SERVICES]: 'Servicios',
      [appFullRoutingNames.LANDING]: 'Landing',
      [authFullRoutingNames.LOGIN]: 'Login',
      [authFullRoutingNames.CHANGE_PASSWORD]: 'CambiarContrasena',
      [authFullRoutingNames.RECOVER_PASSWORD]: 'RecuperarContrasena',
      [authFullRoutingNames.SERVICES_ADD]: 'Afiliación',
      [authFullRoutingNames.COMPANY_REGISTER]: 'Afiliación',
      [authFullRoutingNames.REGISTRATION_FINISHED]: 'Afiliación',
    };
    let moduleParsed = '';
    for (const routesKey in routes) {
      if (url.startsWith(routesKey)) {
        moduleParsed = routes[routesKey];
      }
    }
    return moduleParsed;
  }

  runSatelliteEvent(
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
