import { Component } from "@angular/core";
import { ExcelService } from "src/app/shared/services/excel.service";

@Component({
    selector: 'validation',
    templateUrl: 'validation.html',
  })
  
  export class ValidationComponent  {
  
    constructor(public excelService: ExcelService,
      ) { }
  
  }