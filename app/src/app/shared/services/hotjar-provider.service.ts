import { Injectable } from '@angular/core';
import Hotjar from '@hotjar/browser';
import { filter } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ProviderService } from './provider.service';
import {
  AdobeEventType,
  TrackEventProperties,
  TrackingService,
} from './tracking.service';

@Injectable()
export class HotjarProviderService implements ProviderService {
  private readonly initialized = false;
  enabledPageRouting = false;

  constructor(public trackingService: TrackingService) {
    if (
      this.initialized ||
      !environment.hotjarSiteId ||
      !environment.hotjarVersion
    ) {
      return;
    }
    Hotjar.init(
      Number(environment.hotjarSiteId),
      Number(environment.hotjarVersion),
    );
  }

  startTracking() {
    if (
      this.initialized ||
      !environment.hotjarSiteId ||
      !environment.hotjarVersion
    ) {
      return;
    }
    this.trackingService.pageSubject$
      .pipe(filter(() => this.enabledPageRouting))
      .subscribe((payload) => this.trackPage(payload));
  }

  trackPage(payload: Partial<TrackEventProperties>) {
    const url = new URL(payload.page.url);
    const newPage = url.pathname || window.location.pathname;
    Hotjar.stateChange(newPage);
  }

  trackEvent(event: AdobeEventType) {
    Hotjar.event(event);
  }
}
