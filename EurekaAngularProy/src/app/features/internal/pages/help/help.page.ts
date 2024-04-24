import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { pathOr } from 'ramda';

import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
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

  constructor(private router: Router, protected tracking: TrackingService) {
    const navigation = this.router.getCurrentNavigation();
    const section = pathOr<string>(
      null,
      ['extras', 'state', 'section'],
      navigation
    );
    if (section === 'commissions') {
      this.activeIndex = 6;
    }
  }

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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Ayuda',
      action: 'Click',
      detail: `Abrir panel ${index + 1}`,
      label: 'Titulo',
      typeElement: 'Link',
      location: 'Ayuda',
    });
  }
}
