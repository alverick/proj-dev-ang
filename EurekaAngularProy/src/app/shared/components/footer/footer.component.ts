import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

import {
  AdobeAnalyticsService,
  AdobeEvent,
} from '../../services/adobe-analytics.service';
import { ModalTermsComponent } from '../modal-terms/modal-terms.component';

@Component({
  selector: 'cs-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [DialogService],
})
export class FooterComponent {
  constructor(
    public dialogService: DialogService,
    private adobeAnalytics: AdobeAnalyticsService
  ) {}

  showModalTerms() {
    this.dialogService.open(ModalTermsComponent, {
      width: '810px',
      header: 'Términos y condiciones',
      styleClass: 'modal-custom-cs',
    });

    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Términos y condiciones',
      action: 'Click',
      detail: 'Términos y condiciones',
      label: 'Términos y condiciones',
      typeElement: 'Link',
      location: 'Footer',
    });

    this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
      category: 'Términos y condiciones',
      action: 'modal-view',
      detail: 'Términos y condiciones',
      location: 'Modal',
    });
  }

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
