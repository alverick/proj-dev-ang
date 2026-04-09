import { inject, Injectable } from '@angular/core';
import { isEmpty } from 'ramda';

import { environment } from '../../../environments/environment';
import { ProviderService } from './provider.service';
import { ScriptInjectorService } from './script-injector.service';
import { AdobeEventType, TrackEventProperties } from './tracking.service';
@Injectable()
export class DynatraceProviderService implements ProviderService {
  private readonly scriptUrl: string = environment.dynatrace;
  private readonly scriptInjectorService = inject(ScriptInjectorService);
  constructor() {
    if (isEmpty(this.scriptUrl)) {
      return;
    }
    this.scriptInjectorService.loadScript('Dynatrace', this.scriptUrl, {
      crossOrigin: 'anonymous',
      async: false,
    });
  }
  startTracking(): void {
    throw new Error('Method not implemented.');
  }
  trackPage(_payload: Partial<TrackEventProperties>): void {
    throw new Error('Method not implemented.');
  }
  trackEvent(
    _event: AdobeEventType,
    _payload: Partial<TrackEventProperties>,
  ): void {
    throw new Error('Method not implemented.');
  }
}
