import { DOCUMENT } from '@angular/common';
import {
  type Type,
  ApplicationRef,
  ComponentFactoryResolver,
  Inject,
  Injectable,
  Injector,
} from '@angular/core';
import {
  type DynamicDialogConfig,
  type DynamicDialogRef,
  DialogService,
} from 'primeng/dynamicdialog';
import { pathOr } from 'ramda';

import { AdobeEvent, TrackingService } from './tracking.service';

@Injectable()
export class DynamicDialogService extends DialogService {
  constructor(
    private tracking: TrackingService,
    componentFactoryResolver: ComponentFactoryResolver,
    appRef: ApplicationRef,
    injector: Injector,
    @Inject(DOCUMENT) document: Document
  ) {
    super(componentFactoryResolver, appRef, injector, document);
  }

  open(
    componentType: Type<any>,
    config: DynamicDialogConfig
  ): DynamicDialogRef {
    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: config.header,
      action: 'modal-view',
      detail: pathOr(config.header, ['data', 'detail'], config),
      location: 'Modal',
    });
    return super.open(componentType, config);
  }
}
