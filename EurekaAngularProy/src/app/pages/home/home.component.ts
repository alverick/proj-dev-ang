import { Component, OnInit, Directive, HostListener, ElementRef, ViewChild } from '@angular/core';
import { User } from "src/app/shared/models/user.model";
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { Router } from '@angular/router';
import { Debts, DebtsPagedList } from 'src/app/shared/models/debts';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatDialog, MatSnackBar, MatSnackBarRef, MatDialogRef} from '@angular/material';
import { WayPay } from 'src/app/shared/models/way-pay';
import { Type } from 'src/app/shared/models/type';
import { Date } from 'src/app/shared/models/date';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { DebstFilter } from 'src/app/shared/models/debts-filter.model';
import { NgxSpinnerService } from 'ngx-spinner';

/// DATE PIECKER FORMAT
import {   Output, EventEmitter } from '@angular/core';
import * as _moment from 'moment';  // dejalo si sale error
import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
//// END DATE ////////////////////

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
////////////////////////////

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [

    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

@Directive({
  selector: '[appBlockCopyPaste]'
})


// tslint:disable-next-line:directive-class-suffix
export class HomeComponent implements OnInit {
 
  // cargar excel combo
 // cargaExcel: boolean;
  @ViewChild('cargaExcel') cargaExcel;
 // datepicker format
 @Output() date2: EventEmitter<any> = new EventEmitter<any>();
 // date = new FormControl(moment());

 // inputDate1:string = '';  inputText
 @ViewChild('inputText') inputText: ElementRef;
 @ViewChild('inputDate1') inputDate1: ElementRef;
 @ViewChild('inputDate2') inputDate2: ElementRef;
  // tslint:disable-next-line:no-inferrable-types
  state: boolean = false;
  // tslint:disable-next-line:whitespace
  // tslint:disable-next-line:no-inferrable-types
  pageActual: number = 1;
  ListaValidacion: Boolean;
 // x en los input
  public user: User;
  DebtsArray = [];
  checkboxes: any;

  OcultaListaExcel: boolean = true;
  mostrar: Boolean;
  inputEdit: Boolean;
  InputList: Boolean;

  debtsList: DebtsPagedList;

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

  // tslint:disable-next-line:no-inferrable-types
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
  control: any;

  

  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private router: Router ,
    private excelService: ExcelService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private spinner2: NgxSpinnerService,
    private el: ElementRef, ) {

    }

    InputNombreCodigo(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
       // tslint:disable-next-line:max-line-length
       if (charCode > 31 && (charCode <= 47 || charCode >= 57) &&  (charCode <= 65 || charCode >= 90) &&  (charCode <= 97 || charCode >= 122)  ) {
        return false;
      }
      return true;

    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode <= 46 || charCode >= 57)  ) {
        return false;
      }
      return true;
    }


    @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
      e.preventDefault();
    }

    @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
      e.preventDefault();
    }

    @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
      e.preventDefault();
    }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();
    this.homeService.getServices().subscribe(
      value => {
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

   this.validandoListado();
   this.cargaExcel = false;
  }

  validandoListado() {
    if (localStorage.getItem('tk') === null  ) {
      this.router.navigate(['/login']);
    } else {
      this.consultaDeuda();
    }
  }
  ceroRegistros(): boolean {
      if (localStorage.getItem('tk') === null ||  localStorage.getItem('tk') ===  '') {
        this.router.navigate(['/login']);
        return false;
      } else {
        if (this.debtsList.count === 0) {
          return true;
      } else {
          return false;
      }
      }
  }

/*//////// C R U D ///////////////////// */
// datepiecker format
change(dateEvent) {
  this.date2.emit(dateEvent.value);
}


  consultaDeuda() {
  // tslint:disable-next-line:prefer-const
  let usDatePattern =  /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

      if (this.filtro.dateFrom === null &&  this.filtro.dateTo === null) {
    ///       dateFrom es inputDate1              | dateTo  es inputDate2
        console.log('entro 1');
        if (this.inputDate1.nativeElement.value === '' &&  this.inputDate2.nativeElement.value === '') {
          if (this.filtro.dateFrom > this.filtro.dateTo   ) {
            Swal.fire({
              type: 'error',
              text: 'La fecha "desde" no puede ser mayor a la fecha "hasta"',
            });
            return;
          } else {
                console.log(this.filtro);
               /* this.spinner2.show();*/

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
        } else {
                if (!this.inputDate1.nativeElement.value.match(usDatePattern)) {
                  Swal.fire({
                    type: 'error',
                    text: 'Ingrese correctamente la fecha desde',
                  });
                  return;
                }
                if (!this.inputDate2.nativeElement.value.match(usDatePattern)) {
                  Swal.fire({
                    type: 'error',
                    text: 'Ingrese correctamente las fecha hasta',
                  });
                  return;
                } else {
                      console.log(this.filtro);
                      /*this.spinner2.show();*/

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
        }
         /////  CAMBIO ACA XDEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
      } else {
        console.log('entro 2');
          if ( this.inputDate1.nativeElement.value === '') {
              Swal.fire({
                type: 'error',
              //  text: 'La fecha "desde" no puede estar en blanco',
                text: 'Ingrese una de la fecha desde 2',
              });
              return;
          } else if ( this.inputDate2.nativeElement.value === '') {
              Swal.fire({
                type: 'error',
                text: 'Ingrese una de la fecha hasta 2',
              });
              return;
          } else if ( !this.inputDate1.nativeElement.value.match(usDatePattern)) {
              Swal.fire({
                type: 'error',
                text: 'ingrese correctamente la fecha desde',
              });
              return;
          } else if ( !this.inputDate2.nativeElement.value.match(usDatePattern)) {
            Swal.fire({
              type: 'error',
              text: 'ingrese correctamente la fecha hasta',
            });
            return;
          } else if (this.filtro.dateFrom > this.filtro.dateTo ) {
            Swal.fire({
              type: 'error',
              text: 'La fecha "desde" no puede ser mayor a la fecha "hasta"',
            });
            return;
          } else {
              console.log(this.filtro);
             /* this.spinner2.show();*/

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



}

 

}
  /*//////////////////////////////
  //////////  C R U D ///////////////////////
  ////////////////////////////////////////////////*/
    mostrarx(): boolean {
          // tslint:disable-next-line:max-line-length
          if (this.inputText.nativeElement.value === '' ) {
              return false;
          } else {
            return true;
          }
    }
    mostrarxdate1(): boolean {
      // tslint:disable-next-line:max-line-length
      if (this.inputDate1.nativeElement.value === '' ) {
          return false;
      } else {
        return true;
      }
    }
    mostrarxdate2(): boolean {
      // tslint:disable-next-line:max-line-length
      if (this.inputDate2.nativeElement.value === '' ) {
          return false;
      } else {
        return true;
      }
    }

    limpiarInput() {
       this.inputText.nativeElement.value = '';
 
    }

    limpiardate1() {
      this.inputDate1.nativeElement.value = '';
      this.filtro.dateFrom = null;
    }

    limpiardate2() {
      this.inputDate2.nativeElement.value = '';
      this.filtro.dateTo = null;
    }


  BotonEditar(item: Debts) {
    item.edit = true;
    item.newEmissionDate = item.emissionDate;
    item.newDueDate = item.dueDate;
    item.newConcept = item.concept;
  }

  BotonActualizar(item: Debts) {
    console.log('actualizar', item);
    item.edit = false;
    /*this.spinner2.show();*/
    this.transactionService.editDeuda(item.id, {
      emissionDate: item.newEmissionDate,
      dueDate: item.newDueDate,
      concept: item.newConcept
    }).subscribe(() => this.consultaDeuda());
    /*this.spinner2.hide();*/
  }

  BotonCancela(item: Debts) {
    item.edit = false;
  }

  changePage(nro: number) {
    this.filtro.pageNumber = nro;
    this.consultaDeuda();
  }

  EliminarSeleccionados() {
    /*this.spinner2.show();*/

    const itemsParaEliminar = [];
    this.debtsList.data.forEach(c => {
      if (c.selected) {
        itemsParaEliminar.push(c.id);
      }

    });
    this.transactionService.deleteAll(itemsParaEliminar)
      .subscribe(() => this.consultaDeuda());
      /*this.spinner2.hide();*/
  }

  Eliminar(item: Debts) {
     
Swal.fire({
  text: "¿Esta Seguro de Eliminar el Registro?",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, Borralo'
}).then((result) => {
  if (result.value) {
   /* this.spinner2.show();*/
    this.transactionService.deleteDeuda(item.id)
      .subscribe(() => this.consultaDeuda());
    /*this.spinner2.hide();*/
    
    Swal.fire(
      'Eliminado!',
      'Tu archivo ha sido eliminado',
      'success'
    )
  }
})
/*
    if (confirm('¿Esta Seguro de Eliminar el Registro?')) {
      this.spinner2.show();
      this.transactionService.deleteDeuda(item.id)
        .subscribe(() => this.consultaDeuda());
        this.spinner2.hide();
    }
    /*/
  }

  SeleccionarTodos() {
    console.log('selecctionarTodos');
    this.debtsList.data.forEach(itm => itm.selected = this.selectedAll);
  }


/*//////// O P E N  - D I A L O G ///////////////////// */
MostrarListaSelect(){
  this.OcultaListaExcel = true;
}

  openDialog(service: string) {
    this.OcultaListaExcel = false;
    this.cargaExcel = false;
    console.log('sale el pop up');
    this.excelService.service = service;
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
  // tslint:disable-next-line:component-selector
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})

// tslint:disable-next-line:component-class-suffix
export class DialogDataExampleDialog {
 
  public inputXlsForm: FormGroup;
  public xlsValid: boolean;
  public codigoCliente: String = 'Codigo de Cliente';

  validationExcel = {
    'xls':[
      { type: 'required', message: 'Debes Ingresar un archivo excel'}
    ]
  }

  constructor(public  snackBar: MatSnackBar,
              private excelService: ExcelService,
              public  formBuilder: FormBuilder,
              public  dialogRef: MatDialogRef<DialogDataExampleDialog>

            ) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.inputXlsForm = this.formBuilder.group({
      xls: ['', Validators.required]
    });
  }
  git 
  onChangeFile(event) {
    this.files = event.target.files;
  }

  private files: any;
  get f(){ return this.inputXlsForm.controls;}


   openSnackBar() {
    if(this.inputXlsForm.valid){
    /*service*/
    this.excelService.UploadExcel(this.files, this.excelService.service)
    .subscribe(
      value=>{
        this.excelService.idProcess = value.id;
       // console.table(value);
      }
    )
    this.snackBar.openFromComponent(UploadProgressComponent);
    this.dialogRef.close();
    }else{
      this.xlsValid = true;
    }
  }

  close(){
    this.dialogRef.close();
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
  state = false;
  contador = 0;
  constructor( public dialog: MatDialog, public excelService: ExcelService,
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

  private verifyStatus() {

    // tslint:disable-next-line:prefer-const
    let recursiveFunc = (value) => {

      console.log(value.status);
      if (value.status === "REJECTED") {
        this.excelService.errores = value.errors;
        console.table(value.errors);
        console.log("ABRE DIALOG")
        const dialogRef =  this.dialog.open(ValidationComponent);
        dialogRef.afterClosed()
          .subscribe(() => {
            this.excelService.errores = [];
            this.excelService.idProcess = 0;
          });
        this.snackRef.dismiss();

      } else if (value.status === "COMPLETED"){
        this.snackRef.dismiss();
        this.excelService.errores = [];
        this.excelService.idProcess = 0;
        Swal.fire({
          type: 'success',
          text: `Se cargaron ${value.rowsUploaded} registros`
        });
      } else  {
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

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.snackRef.dismiss();
  }
}










/*///////////////////////////////////////////////////////////////////////////
///////////////// V A L I D A T I O N   //////////////////////////
////////////////////////////////////////////////////////////////////////////// */

let error: Error;

@Component({
  selector: 'validation',
  templateUrl: 'validation.html',
})

export class ValidationComponent  {

  constructor(public excelService: ExcelService,
    ) { }

}