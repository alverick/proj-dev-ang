import { Component, OnInit } from '@angular/core';
import { User } from "src/app/shared/models/user.model";
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { takeUntil } from 'rxjs/operators';
import { Subject} from 'rxjs';
import { Router } from '@angular/router';
import { Debts } from 'src/app/shared/models/debts';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatDialog, MatSnackBar,MatSnackBarRef, MatDialogRef} from '@angular/material';
import { WayPay } from 'src/app/shared/models/way-pay';
import { Type } from 'src/app/shared/models/type';
import { Date } from 'src/app/shared/models/date';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TransactionService } from 'src/app/shared/services/transaction.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html', 
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
 
  state: boolean = false;
  pageActual : number= 1;

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

  debtsList : Debts[]; 
 
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


  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    private transactionService: TransactionService,
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

    /*///////S E R V I C E //////// */
      /*this.consultDeuda();*/
    /*///////C O M B O S ////////// */ 
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
  


  /*//////////////////////////////
  //////////  C R U D /////////////////////// 
  ////////////////////////////////////////////////*/
/*
  consultDeuda(){
    this.transactionService.getDeuda(this.pageActual).subscribe(
      value =>{
        this.debtsList = value; 
    }); 


  }*/

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
/*
  EliminarSeleccionados(){
    alert(this.DebtsArray);
     
     if (this.DebtsArray.length > 0) { 
      for (const value in this.DebtsArray) { 
        this.DebtsList.splice(this.DebtsArray[value],1);
      } 
      alert('eliminados');
      this.DebtsArray  = []; 
    }else {
       alert('seleccione algun elemento para eliminar');
    }
  }
*/
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









/*////////////////////////////////////////////////////////
///////////////// D I A L O G //////////////////////////
///////////////////////////////////////////////////////// */


@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})

export class DialogDataExampleDialog {

  public inputXlsForm: FormGroup;

  /*Data Parcial */
  dataParcial: any = [{  eid: 'e101',    ename: 'ravi',    esal: 1000},  { eid: 'e102',  ename: 'ram',    esal: 2000  },  { eid: 'e103',   ename: 'rajesh',    esal: 300}];

  /*Data Completa */
  dataCompleta: any = [{ eid: 'e101',    ename: 'ravi',   eapellido: 'ravi',   eemail: 'email',   estado: 'deudor', fecha: '16/05/15',   esal: 1000, }, {   eid: 'e102',   ename: 'ram',   eapellido: 'ravi',    eemail: 'email',    estado: 'deudor',  fecha: '16/05/15', esal: 2000},  {eid: 'e103',  ename: 'rajesh',   eapellido: 'ravi',   eemail: 'email',   estado: 'deudor',   fecha: '16/05/15', esal: 3000},
    {  eid: 'e104',  ename: 'chris',  eapellido: 'ravi',  eemail: 'email', estado: 'deudor', fecha: '16/05/15',  esal: 6000 },
    {  eid: 'e105', ename: 'jhon', eapellido: 'ravi',   eemail: 'email', estado: 'deudor',   fecha: '16/05/15',  esal: 15000}];
  
  constructor(public  snackBar: MatSnackBar,
              private excelService: ExcelService,
              public  formBuilder: FormBuilder,
              public  dialogRef: MatDialogRef<DialogDataExampleDialog>

            ) { }

  ngOnInit(){
    this.inputXlsForm = this.formBuilder.group({
      xls: ['',Validators.required]
    })
  }
  
  onChangeFile(event) {
    this.files = event.target.files;
  }

  private files: any;
  get f(){ return this.inputXlsForm.controls;}

  
   openSnackBar() {
    if(this.inputXlsForm.valid){
    /*service*/
    this.excelService.UploadExcel(this.files)
    .subscribe(
      value=>{
        this.excelService.idProcess = value.id;
      }
    )
    this.snackBar.openFromComponent(UploadProgressComponent);      
    this.dialogRef.close();
    }else{
      alert('Ingresa el excel');
    }
  }


  exportDataParcialXLSX():void {
    this.excelService.exportAsExcelFile(this.dataParcial, 'data_parcial');
  }

  exportDataCompletaXLSX():void{
    this.excelService.exportAsExcelFile(this.dataCompleta, 'data_completa');
  }

  
} 









/*///////////////////////////////////////////////////////////////////////////
///////////////// P R O G R E S S / S N A C K B A R //////////////////////////
////////////////////////////////////////////////////////////////////////////// */

@Component({
  selector: 'upload-progress',
  templateUrl: 'upload-progress.html',
})

export class UploadProgressComponent  implements OnInit  {
   state: boolean = false;

  constructor( public dialog: MatDialog, private excelService: ExcelService,
                private snackRef: MatSnackBarRef<UploadProgressComponent>) { }

  ngOnInit(){
    var th = this;
    var fnc = () => {
      if (th.excelService.idProcess > 0) {
        th.verifyStatus();
      }
      else {
        setTimeout(fnc, 500);
      }
    };
    setTimeout(fnc, 500);
  }

  private verifyStatus()  {
    
    var recursiveFunc = (value) => {

      if (value.status === "REJECTED") {
        this.excelService.errores = value.errors;
        console.log("ABRE DIALOG")
        const dialogRef =  this.dialog.open(ValidationComponent);
        this.snackRef.dismiss();
      
        //value.errors
      }
      else if (value.status === "COMPLETED") {
        var th = this;
        setTimeout(() => {
          th.excelService.StatusExcel(th.excelService.idProcess)
            .subscribe(recursiveFunc);
        }, 500);
        this.snackRef.dismiss();
        Swal.fire({
          type: 'success',
          text: 'Cargó con éxito tu excel'
        }) 
        //Delay (10 ms)
        // Volver a llamar a status
      }
    };
    setTimeout(() => {
      this.excelService.StatusExcel(this.excelService.idProcess)
      .subscribe(recursiveFunc);     
      this.snackRef.dismiss();

    }, 800);
  }

}




/*///////////////////////////////////////////////////////////////////////////
///////////////// V A L I D A T I O N   //////////////////////////
////////////////////////////////////////////////////////////////////////////// */

error: Error;

@Component({
  selector: 'validation',
  templateUrl: 'validation.html',
})

export class ValidationComponent implements OnInit {
 
  constructor(private excelService: ExcelService,
    ) { }

  ngOnInit(){
    
  }


  
}



















 /*

 @Component({
  selector: 'app-upload-progress-snackbar',
  template: `<mat-progress-bar   mode="determinate"  [value]="progress">
              </mat-progress-bar>`,
  styles: [`mat-progress-bar { margin-top: 5px; }`],
})
 constructor( @Inject(MAT_SNACK_BAR_DATA) public data,
              private _snackRef: MatSnackBarRef<UploadProgressComponent>,
              private ren:Renderer2) { 
        
        setTimeout(()=>{
        let snackEl = document.getElementsByClassName('mat-snack-bar-container').item(0);
        ren.listen(snackEl, 'click', ()=>this.dismiss())
      })
    }

  private started = false;
  public progress = 50;

  dismiss(){
    this._snackRef.dismiss();
  }















   openSnackBar() {
    if(this.inputXlsForm.valid){
    this.snackBar.openFromComponent(UploadProgressComponent, {
      data: { uploadProgress: 80 }});
      
    }else{
      alert('Ingresa el excel');
    }
  }*/