
import { type AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { pathOr } from 'ramda';
import { isNotNil } from 'ramda-adjunct';

import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { sectionCommissions } from '../../constants';
import { internalFullRoutingNames } from '../../internal-routing.names';

/**
 * Help page component
 */
@Component({
    selector: 'cs-help',
    templateUrl: './help.page.html',
    standalone: true,
    imports: [AccordionModule]
})
export class HelpPage implements AfterViewInit {
  /**
   * Accordion active index
   */
  activeIndex: number;

  constructor(
    private readonly router: Router,
    protected tracking: TrackingService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const section = pathOr<string>(
      null,
      ['extras', 'state', 'section'],
      navigation,
    );
    if (section === sectionCommissions) {
      this.activeIndex = 6;
    }
  }

  ngAfterViewInit(): void {
    if (isNotNil(this.activeIndex)) {
      const accordion = document.querySelector(
        `.p-accordion.p-component p-accordiontab:nth-child(${this.activeIndex})`,
      );

      if (isNotNil(accordion)) {
        setTimeout(() => {
          window.scrollTo({
            top: 1000,
            behavior: 'smooth',
          });
        }, 500);
      }
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
  openedTab({ index }: { index: number }) {
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
