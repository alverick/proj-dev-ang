import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

import { headerModalTerms, modalTermsConfig } from '../../constants/modal-data';
import { AdobeEvent, TrackingService } from '../../services/tracking.service';
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
    private tracking: TrackingService
  ) {}

  showModalTerms() {
    this.dialogService.open(ModalTermsComponent, modalTermsConfig);

    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: headerModalTerms,
      action: 'Click',
      detail: headerModalTerms,
      label: headerModalTerms,
      typeElement: 'Link',
      location: 'Footer',
    });

    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: headerModalTerms,
      action: 'modal-view',
      detail: headerModalTerms,
      location: 'Modal',
    });
  }

  clickWa() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Contáctanos',
      action: 'Click',
      detail: 'Enlace a whatsapp',
      label: '993 119 001',
      typeElement: 'Link',
      location: 'Footer',
    });
  }
}
