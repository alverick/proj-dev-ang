import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { pathEq } from 'ramda';

import {
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../services/adobe-analytics.service';

@Component({
  selector: 'cs-fab-whatsapp',
  templateUrl: './fab-whatsapp.component.html',
  styleUrls: ['./fab-whatsapp.component.scss'],
})
export class FabWhatsappComponent implements OnChanges {
  @Input() showButton = true;
  showText = true;
  url = '';
  timeToHide = 10000;
  constructor(
    private adobeAnalytics: AdobeAnalyticsService,
    protected router: Router
  ) {
    setTimeout(() => (this.showText = false), this.timeToHide);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.url = val.urlAfterRedirects;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (pathEq(['showButton', 'currentValue'], true, changes)) {
      this.showText = true;
      setTimeout(() => (this.showText = false), this.timeToHide);
    }
  }
  clickWa() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Comunícate',
      action: 'Click',
      detail: 'Comunícate con nosotros whatsapp',
      label: 'Comunícate con nosotros',
      typeElement: 'Botón',
      module: this.adobeAnalytics.parseModule(this.url),
      location: 'Floating',
    });
  }
}
