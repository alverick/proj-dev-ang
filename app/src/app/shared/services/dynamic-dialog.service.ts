import {
  ApplicationRef,
  DOCUMENT,
  Inject,
  Injectable,
  Injector,
  type Type,
} from '@angular/core';
import {
  DialogService,
  type DynamicDialogConfig,
  type DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { pathOr } from 'ramda';

import { AdobeEvent, TrackingService } from './tracking.service';

@Injectable()
export class DynamicDialogService extends DialogService {
  private readonly stackRefs: DynamicDialogRef[] = [];
  constructor(
    private readonly tracking: TrackingService,
    appRef: ApplicationRef,
    injector: Injector,
    @Inject(DOCUMENT) document: Document,
  ) {
    super(appRef, injector, document);
  }

  open<T>(componentType: Type<T>, config: DynamicDialogConfig) {
    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: config.header,
      action: 'modal-view',
      detail: pathOr(config.header, ['data', 'detail'], config),
      location: 'Modal',
    });
    const modal = super.open(componentType, config);
    this.stackRefs.push(modal);
    return modal;
  }

  closeAll() {
    this.stackRefs.forEach((ref) => ref.destroy());
  }
}
