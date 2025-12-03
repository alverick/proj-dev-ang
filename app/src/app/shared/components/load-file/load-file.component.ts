import { Component, inject } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'cs-load-file',
  templateUrl: './load-file.component.html',
  imports: [ProgressBarModule],
})
export class LoadFileComponent {
  excelService = inject(ExcelService);

  public progress = {
    status: 'Subiendo',
    mode: 'indeterminate',
    value: 0,
  };
}
