import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

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
    this.dialogService.open(ModalTermsComponent, {
      width: '810px',
      header: 'Términos y condiciones',
      styleClass: 'modal-custom-cs',
    });

    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Términos y condiciones',
      action: 'Click',
      detail: 'Términos y condiciones',
      label: 'Términos y condiciones',
      typeElement: 'Link',
      location: 'Footer',
    });

    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: 'Términos y condiciones',
      action: 'modal-view',
      detail: 'Términos y condiciones',
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
