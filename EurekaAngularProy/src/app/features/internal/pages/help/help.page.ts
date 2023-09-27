import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../../../shared/services/adobe-analytics.service';
import { internalFullRoutingNames } from '../../internal-routing.names';

@Component({
  selector: 'cs-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage {
  activeIndex: number;
  constructor(
    private router: Router,
    protected adobeAnalytics: AdobeAnalyticsService
  ) {}

  goBack() {
    void this.router.navigate([internalFullRoutingNames.HOME]);
  }

  openedTab({ index }: { index: number }) {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Ayuda',
      action: 'Click',
      detail: `Abrir panel ${index + 1}`,
      label: 'Titulo',
      typeElement: 'Link',
      location: 'Ayuda',
    });
  }
}
