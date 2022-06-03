import { Component } from '@angular/core';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrls: ['./load-file.component.scss'],
})
export class LoadFileComponent {
  public progress: any = {
    status: 'Subiendo',
    mode: 'indeterminate',
    value: 0,
  };

  constructor(public excelService: ExcelService) {}
}
