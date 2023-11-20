import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../../../shared/services/adobe-analytics.service';
import { internalFullRoutingNames } from '../../internal-routing.names';

/**
 * Help page component
 */
@Component({
  selector: 'cs-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage {
  /**
   * Accordion active index
   */
  activeIndex: number;
  constructor(
    private router: Router,
    protected adobeAnalytics: AdobeAnalyticsService
  ) {}

  /**
   * Go home link
   */
  goBack() {
    void this.router.navigate([internalFullRoutingNames.HOME]);
  }

  /**
   * Track opened tab with adobe
   * @param evt
   * @param evt.index
   */
  openedTab({ index }) {
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
