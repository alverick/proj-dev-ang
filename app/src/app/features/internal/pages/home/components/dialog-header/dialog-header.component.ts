import { CommonModule, NgClass } from '@angular/common'; // Import CommonModule
import { Component, HostBinding, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TimesIcon } from 'primeng/icons';

import { ExcelService } from '../../../../../../shared/services/excel.service';

@Component({
  selector: 'cs-dialog-header',
  imports: [CommonModule, NgClass, TimesIcon],
  templateUrl: './dialog-header.component.html',
})
export class DialogHeaderComponent {
  excelService = inject(ExcelService);
  ref = inject(DynamicDialogRef);

  @HostBinding('class') class = 'tw-w-full';

  hide() {
    this.ref.close();
  }
}
