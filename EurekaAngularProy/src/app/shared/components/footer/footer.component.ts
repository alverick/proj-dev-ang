import { Component } from '@angular/core';

import {
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../services/adobe-analytics.service';

@Component({
  selector: 'cs-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(private adobeAnalytics: AdobeAnalyticsService) {}

  clickWa() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Contáctanos',
      action: 'Click',
      detail: 'Enlace a whatsapp',
      label: '993 119 001',
      typeElement: 'Link',
      location: 'Footer',
    });
  }
}
