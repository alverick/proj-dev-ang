import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { clone } from 'ramda';
import { ReplaySubject } from 'rxjs';

import {
  appModuleRoutingNames,
  authFullRoutingNames,
  internalFullRoutingNames,
} from '../../app-routing.collection';
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
  value: string | boolean | number;
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

export interface TrackEventProperties {
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

export type EventTrackType = {
  event: AdobeEventType;
  eventProperties?: Partial<ActionEventProperties>;
  payload: Partial<TrackEventProperties>;
};

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
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
  pageSubject$ = new ReplaySubject<Partial<TrackEventProperties>>(10);
  eventSubject$ = new ReplaySubject<EventTrackType>(10);

  constructor(private storageService: StorageService, private router: Router) {
    const session = this.storageService.getCurrentSession();
    if (session?.isAuthenticate) {
      this.setRuc(window.sessionStorage.getItem('username'));
    }
  }

  setRuc(ruc: string) {
    if ('undefined' !== typeof ruc && ruc) {
      this.payload.user.codRuc = ruc;
    }
  }

  startRouterPageTracking() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.trackPage(val.urlAfterRedirects);
      }
    });
  }

  trackEvent(
    event: AdobeEventType,
    eventProperties?: Partial<ActionEventProperties>
  ) {
    const payload = clone(this.payload);
    this.eventSubject$.next({ event, eventProperties, payload });
  }

  trackPage(path: string) {
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
    this.pageSubject$.next(payload);
  }

  private parseModule(url: string) {
    const routes: Record<string, string> = {
      [internalFullRoutingNames.HELP]: 'Ayuda',
      [internalFullRoutingNames.HOME]: 'Home',
      [internalFullRoutingNames.COMPANY]: 'ConfiguracionEmpresa',
      [internalFullRoutingNames.SERVICES]: 'Servicios',
      [appModuleRoutingNames]: 'Landing',
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
}
