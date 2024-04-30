import { Component } from '@angular/core';

import { headerModalTerms, modalTermsConfig } from '../../constants/modal-data';
import { DynamicDialogService } from '../../services/dynamic-dialog.service';
import { AdobeEvent, TrackingService } from '../../services/tracking.service';
import { ModalTermsComponent } from '../modal-terms/modal-terms.component';

@Component({
  selector: 'cs-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [DynamicDialogService],
})
export class FooterComponent {
  constructor(
    public dialogService: DynamicDialogService,
    private tracking: TrackingService
  ) {}

  showModalTerms() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: headerModalTerms,
      action: 'Click',
      detail: headerModalTerms,
      label: headerModalTerms,
      typeElement: 'Link',
      location: 'Footer',
    });

    this.dialogService.open(ModalTermsComponent, modalTermsConfig);
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
