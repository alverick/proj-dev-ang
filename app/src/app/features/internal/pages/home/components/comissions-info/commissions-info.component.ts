import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Ripple } from 'primeng/ripple';
import { pathOr } from 'ramda';

import { TrackingService } from '../../../../../../shared/services';

@Component({
    selector: 'cs-commissions-info',
    templateUrl: './commissions-info.component.html',
    imports: [ButtonDirective, Ripple]
})
export class CommissionsInfoComponent {
  showed = false;
  constructor(
    public tracking: TrackingService,
    public router: Router,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {
    this.showed = pathOr(false, ['data', 'showed'], config);
  }

  close(action = '') {
    this.dialogRef.close(action);
  }
}
