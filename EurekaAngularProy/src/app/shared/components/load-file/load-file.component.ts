import { Component } from '@angular/core';

import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'cs-load-file',
  templateUrl: './load-file.component.html',
})
export class LoadFileComponent {
  public progress = {
    status: 'Subiendo',
    mode: 'indeterminate',
    value: 0,
  };

  constructor(public excelService: ExcelService) {}
}
