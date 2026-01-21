import {
  ApplicationRef,
  DOCUMENT,
  inject,
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
  private readonly tracking = inject(TrackingService);

  private readonly stackRefs: DynamicDialogRef[] = [];
  constructor() {
    const appRef = inject(ApplicationRef);
    const injector = inject(Injector);
    const document = inject<Document>(DOCUMENT);

    super(appRef, injector, document);
  }

  open<T>(componentType: Type<T>, config: DynamicDialogConfig) {
    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: config.header,
      action: 'modal-view',
      detail: pathOr(config.header, ['data', 'detail'], config),
      location: 'Modal',
    });
    const modal = super.open(componentType, { ...config, draggable: false });
    this.stackRefs.push(modal);
    return modal;
  }

  closeAll() {
    this.stackRefs.forEach((ref) => ref.destroy());
  }
}
