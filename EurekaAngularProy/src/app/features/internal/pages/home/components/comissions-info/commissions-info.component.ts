import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { propOr } from 'ramda';

import { TrackingService } from '../../../../../../shared/services/tracking.service';

@Component({
  selector: 'cs-commissions-info',
  templateUrl: './commissions-info.component.html',
})
export class CommissionsInfoComponent {
  showed = false;
  constructor(
    public tracking: TrackingService,
    public router: Router,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.showed = propOr(false, 'showed', config.data);
  }

  close(action = '') {
    this.dialogRef.close(action);
  }
}
