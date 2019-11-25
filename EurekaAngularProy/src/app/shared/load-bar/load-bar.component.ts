import { Component } from "@angular/core";
import { ExcelService } from "../services/excel.service";

@Component({
  selector: 'app-load-bar',
  templateUrl: './load-bar.component.html',
  styleUrls: ['./load-bar.component.scss']
})
export class LoadBarComponent {
  public progress: any = {
    mode: 'indeterminate',
    value: 0
  }

  constructor() { }
}
