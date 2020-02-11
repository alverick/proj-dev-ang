import { OnInit, Component } from "@angular/core";
import { ExcelService } from "src/app/shared/services/excel.service";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-agrega-cobro',
  templateUrl: './agrega-cobro.component.html',
  styleUrls: ['./agrega-cobro.component.scss'],
})
export class AgregaCobroComponent implements OnInit {
  constructor(public excelService: ExcelService,
    public  dialogRef: MatDialogRef<AgregaCobroComponent>) {}

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  chooseWeb() {
    this.dialogRef.close({ medio: 'web' });
  }

  chooseExcel() {
    this.dialogRef.close({ medio: 'excel' });
  }
}
