import { NgClass } from '@angular/common';
import {
  Component,
  inject,
  input,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { pathEq } from 'ramda';

import { AdobeEvent, TrackingService } from '../../services/tracking.service';

@Component({
  selector: 'cs-fab-whatsapp',
  templateUrl: './fab-whatsapp.component.html',
  styleUrls: ['./fab-whatsapp.component.scss'],
  imports: [NgClass],
})
export class FabWhatsappComponent implements OnChanges {
  private readonly tracking = inject(TrackingService);
  protected router = inject(Router);

  readonly showButton = input(true);
  readonly expand = input(true);
  showText = true;
  url = '';
  timeToHide = 10000;
  constructor() {
    setTimeout(() => (this.showText = false), this.timeToHide);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.url = val.urlAfterRedirects;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (pathEq(true, ['showButton', 'currentValue'], changes)) {
      this.showText = true;
      setTimeout(() => (this.showText = false), this.timeToHide);
    }
  }
  clickWa() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Comunícate',
      action: 'Click',
      detail: 'Comunícate con nosotros whatsapp',
      label: 'Comunícate con nosotros',
      typeElement: 'Botón',
      location: 'Floating',
    });
  }
}
