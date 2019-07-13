import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { User } from "src/app/shared/models/user.model";
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Debts } from 'src/app/shared/models/debts';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';
import { WayPay } from 'src/app/shared/models/way-pay';
import { Type } from 'src/app/shared/models/type';
import { Date } from 'src/app/shared/models/date';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html', 
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  
  public user: User;
  DebtsArray = [];
  checkboxes: any;
  private unsubscribe$  =  new  Subject();
  private unsubscribe2$ = new Subject(); 
  private unsubscribe3$ = new Subject();
  private unsubscribe4$ = new Subject();
  private unsubscribe5$ = new Subject();

  mostrar: Boolean;
  BotonEditar: Boolean;
  BotonCancelar: Boolean;
  inputEdit: Boolean;
  InputList: Boolean;  
  DebtsList : Debts[]; 
 
  typeList: Type[];
  waypayList: WayPay[];
  DateList: Date[];

  typeSelected: String;
  type: String[];

  wayPaySelected:  String;
  wayPay: String[];

  dateSelected: String;
  date: String[];

  serviceSelected: String;
  services: String[];

 /*Data Parcial */
  dataParcial: any = [{  eid: 'e101',    ename: 'ravi',    esal: 1000},  { eid: 'e102',  ename: 'ram',    esal: 2000  },  { eid: 'e103',   ename: 'rajesh',    esal: 300}];

 /*Data Completa */
  dataCompleta: any = [{ eid: 'e101',    ename: 'ravi',   eapellido: 'ravi',   eemail: 'email',   estado: 'deudor', fecha: '16/05/15',   esal: 1000, }, {   eid: 'e102',   ename: 'ram',   eapellido: 'ravi',    eemail: 'email',    estado: 'deudor',  fecha: '16/05/15', esal: 2000},  {eid: 'e103',  ename: 'rajesh',   eapellido: 'ravi',   eemail: 'email',   estado: 'deudor',   fecha: '16/05/15', esal: 3000},
  {  eid: 'e104',  ename: 'chris',  eapellido: 'ravi',  eemail: 'email', estado: 'deudor', fecha: '16/05/15',  esal: 6000 },
  {  eid: 'e105', ename: 'jhon', eapellido: 'ravi',   eemail: 'email', estado: 'deudor',   fecha: '16/05/15',  esal: 15000}];

  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    private router: Router ,
    private excelService: ExcelService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();
    this.homeService.getServices().pipe(takeUntil(this.unsubscribe$)).subscribe(
      value =>{
        this.services = value;
        this.serviceSelected = value[0];
        console.log("Servicios seleccionado : " + this.serviceSelected)
        console.log("Servicios : " + this.services)
      }
    );
    this.homeService.getDebts().pipe(takeUntil(this.unsubscribe2$)).subscribe(
      value => {
        this.DebtsList = value; 
      }
    );
    this.homeService.getType().pipe(takeUntil(this.unsubscribe3$)).subscribe(
      value => {
        this.typeList = value; 
    }); 
    this.homeService.getWayPay().pipe(takeUntil(this.unsubscribe4$)).subscribe(
      value => {
        this.waypayList = value; 
    }); 
    this.homeService.getDate().pipe(takeUntil(this.unsubscribe5$)).subscribe(
      value => {
        this.DateList = value; 
    });  
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDataExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  

  consult(){
    this.router.navigateByUrl("['/subirPlantilla']");
  }

  exportDataParcialXLSX():void {
    this.excelService.exportAsExcelFile(this.dataParcial, 'data_parcial');
  }

  exportDataCompletaXLSX():void{
    this.excelService.exportAsExcelFile(this.dataCompleta, 'data_completa');
  }

  BotonActualizar(id: number){
    this.mostrar  = false;
    this.BotonEditar = true;
    this.BotonCancelar = true;
    this.inputEdit = true;
    this.InputList = false;
   // alert(id); 
  }

  BotonCancela(){
    this.mostrar  = true; 
    this.BotonEditar = false;
    this.BotonCancelar = false;
    
    this.inputEdit = false;
    this.InputList = true;
  }


  SeleccionarParaEliminar(idDebt: number){
  
    //alert(idDebt);
     this.DebtsArray.push(idDebt);
  /*
    if (this.DebtsArray.length === 0) {
      this.DebtsArray.push(idDebt); 
    } else{
      for (const value in this.DebtsArray) { 
        if(this.DebtsArray[value] === idDebt){
          this.DebtsList.splice(this.DebtsArray[value],1)
          alert(idDebt + ' ya esta agregado y se elimino');
        }
        else{
          this.DebtsArray.push(idDebt);
          alert(idDebt + ' agregado');
        }
    }
    }  
*/

     
  }

  EliminarSeleccionados(){
    alert(this.DebtsArray);
     
     if (this.DebtsArray.length > 0) { 
      for (const value in this.DebtsArray) { 
        this.DebtsList.splice(this.DebtsArray[value],1);
 
      } 
      alert('eliminados');
      this.DebtsArray  = []; 
   } else {
       alert('seleccione algun elemento para eliminar');
   }

  }

  SeleccionarTodos() {
   /* this.checkboxes  = document.getElementsByTagName('input')
    
    alert(this.checkboxes);
     
     for (const valinput in this.checkboxes){
       
          if(this.checkboxes[valinput].type === "checkbox"){
            this.cont++;
          } 
     } 
     alert(this.cont.toString());
    */ 
  }

}


@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})

export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              public snackBar: MatSnackBar) {}


  openSnackBar() {
    this.snackBar.openFromComponent(UploadProgressComponent, {
      data: { uploadProgress: 50 }
    })
    ;
  }
} 


@Component({
  selector: 'app-upload-progress-snackbar',
  template: `
  Progress:
  <mat-progress-bar mode="determinate" [value]="progress" *ngIf="progress !== undefined"></mat-progress-bar> Click Me To Dissmiss`,
  styles: [`mat-progress-bar { margin-top: 5px;}`],
})
export class UploadProgressComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data,
    private _snackRef: MatSnackBarRef<UploadProgressComponent>,
    private ren:Renderer2
    ) { 
      setTimeout(()=>{
        let snackEl = document.getElementsByClassName('mat-snack-bar-container').item(0);
        ren.listen(snackEl, 'click', ()=>this.dismiss())
      })
    }

  private started = false;
  public progress = 50;
  // public progress = this.data.uploadProgress.pipe(
  //   map(({ loaded, total }) => {
  //     if (loaded === undefined) {
  //       return !this.started ? 0 : 100;
  //     } else {
  //       this.started = true;
  //       return Math.round(loaded / (total || loaded) * 100);
  //     }
  //   },
  //   ));

  dismiss(){
    this._snackRef.dismiss();
  }
}