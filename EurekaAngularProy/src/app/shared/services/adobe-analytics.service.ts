import { Injectable } from '@angular/core';
import { isEmpty } from 'ramda';

import { environment } from '../../../environments/environment';
import { ScriptInjectorService } from './script-injector.service';

interface Satellite {
  pageBottom(): void;
}

declare const _satellite: Satellite;

@Injectable({
  providedIn: 'root',
})
export class AdobeAnalyticsService {
  constructor(private scriptInjectorService: ScriptInjectorService) {}

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
}
