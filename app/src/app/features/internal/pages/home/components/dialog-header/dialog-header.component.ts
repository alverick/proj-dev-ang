import { NgClass } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TimesIcon } from 'primeng/icons/times';

import { ExcelService } from '../../../../../../shared/services/excel.service';

@Component({
  selector: 'cs-dialog-header',
  imports: [NgClass, TimesIcon],
  templateUrl: './dialog-header.component.html',
})
export class DialogHeaderComponent {
  @HostBinding('class') class = 'tw-w-full';

  constructor(
    public excelService: ExcelService,
    public ref: DynamicDialogRef,
  ) {}

  hide() {
    this.ref.close();
  }
}
