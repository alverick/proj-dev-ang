import { Component, OnInit } from '@angular/core';
import { User } from "src/app/shared/models/user.model";
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { Router } from '@angular/router';
import { Debts, DebtsPagedList } from 'src/app/shared/models/debts';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatDialog, MatSnackBar,MatSnackBarRef, MatDialogRef} from '@angular/material';
import { WayPay } from 'src/app/shared/models/way-pay';
import { Type } from 'src/app/shared/models/type';
import { Date } from 'src/app/shared/models/date';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { DebstFilter } from 'src/app/shared/models/debts-filter.model';

import { NgxSpinnerService } from 'ngx-spinner';

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

  mostrar: Boolean;
  inputEdit: Boolean;
  InputList: Boolean;  

  debtsList : DebtsPagedList; 
 
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

  selectedAll: boolean = false;

  filtro: DebstFilter = {
    pageNumber: 1,
    columnName: 'FirstName',
    asc: true,
    inputSearch: '',
    service: '',
    status: '',
    dateForFilter: '',
    dateFrom: null,
    dateTo: null
  };

  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private router: Router ,
    private excelService: ExcelService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private spinner2: NgxSpinnerService,
    ) { }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();
    this.homeService.getServices().subscribe(
      value =>{
        this.services = value;
        this.serviceSelected = value[0];

      }
    );

    this.homeService.getType().subscribe(
      value => {
        this.typeList = value; 
    }); 
    this.homeService.getWayPay().subscribe(
      value => {
        this.waypayList = value; 
    }); 
    this.homeService.getDate().subscribe(
      value => {
        this.DateList = value; 
    });  

    this.consultaDeuda();
  }

/*//////// C R U D ///////////////////// */
  
  consultaDeuda() {
    console.log(this.filtro);
    this.spinner2.show();

    this.debtsList = {
      count: 0,
      data: []
    };
    this.transactionService.getDeuda(this.filtro)
      .subscribe(debts => {
        console.log(debts);
        this.debtsList = debts;
        this.spinner2.hide();

      });
  }

  BotonEditar(item: Debts) {
    this.spinner2.show();
    item.edit = true;
    item.newEmissionDate = item.emissionDate;
    item.newDueDate = item.dueDate;
    item.newConcept = item.concept;
  }

  BotonActualizar(item: Debts){
    console.log('actualizar', item);
    item.edit = false;
    this.transactionService.editDeuda(item.id, {
      emissionDate: item.newEmissionDate,
      dueDate: item.newDueDate,
      concept: item.newConcept
    }).subscribe(() => this.consultaDeuda());
  }

  BotonCancela(item: Debts){
    item.edit = false;
  }

  changePage(nro: number) {
    this.filtro.pageNumber = nro;
    this.consultaDeuda();
  }

  EliminarSeleccionados(){
    this.spinner2.show();

    let itemsParaEliminar = [];
    this.debtsList.data.forEach(c => {
      if (c.selected) 
        itemsParaEliminar.push(c.id);

    });
    this.transactionService.deleteAll(itemsParaEliminar)
      .subscribe(() => this.consultaDeuda());
  }

  Eliminar(item: Debts) {
    this.spinner2.show();
    if (confirm("¿Esta Seguro de Eliminar el Registro?")) {
      this.transactionService.deleteDeuda(item.id)
        .subscribe(() => this.consultaDeuda());
    }
  }

  SeleccionarTodos() {
    console.log('selecctionarTodos');
   this.debtsList.data.forEach(itm => itm.selected = this.selectedAll);
  }


/*//////// O P E N  - D I A L O G ///////////////////// */
  

  openDialog() {
    const dialogRef = this.dialog.open(DialogDataExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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

      console.log(value.status);
      if (value.status === "REJECTED") {
        this.excelService.errores = value.errors;
        console.log("ABRE DIALOG")
        const dialogRef =  this.dialog.open(ValidationComponent);
        dialogRef.afterClosed()
          .subscribe(() => {
            this.excelService.errores = [];
            this.excelService.idProcess = 0;
          });
        this.snackRef.dismiss();

      }
      else if (value.status === "COMPLETED"){
        this.snackRef.dismiss();
        this.excelService.errores = [];
        this.excelService.idProcess = 0;
        Swal.fire({
          type: 'success',
          text: 'Cargó con éxito tu excel'
        });
      }
      else  {
        var th = this;
        setTimeout(() => {
          th.excelService.StatusExcel(th.excelService.idProcess)
            .subscribe(recursiveFunc);
        }, 500);

      }
    };
    setTimeout(() => {
      this.excelService.StatusExcel(this.excelService.idProcess)
      .subscribe(recursiveFunc);
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

export class ValidationComponent  {
 
  constructor(private excelService: ExcelService,
    ) { }

}