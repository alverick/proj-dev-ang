import { Component, OnInit, Directive, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { Router } from '@angular/router';
import { Debts, DebtsPagedList } from 'src/app/shared/models/debts';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatDialog, MatSnackBar, MatSnackBarRef, MatDialogRef} from '@angular/material';
import { WayPay } from 'src/app/shared/models/way-pay';
import { Type } from 'src/app/shared/models/type';
import { Date } from 'src/app/shared/models/date';
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
import { DebtEdit } from 'src/app/shared/models/debts-edit.model';
import { DialogComponent } from './dialog';
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

  numeroPagina:number;
  ///ORDENES DE LA TABLA
  ascFeEmisiongray: boolean = false;
  ascFeEmisionblue: boolean = true;
  descFeEmisionblue: boolean = true;
  descFeEmisiongray: boolean = false; 
  //fecha de vencimiento

  ascFeVctgray: boolean = false;
  ascFeVctblue: boolean = true;
  dscFeVctblue: boolean = true;
  dscFeVctgray: boolean = false; 

  //codigicliente
  asccodgray: boolean = false;
  asccodblue: boolean = true;
  dsccodiblue: boolean = true;
  dsccodigray: boolean = false; 
  // name
  ascnamegray: boolean = false;
  ascnameblue: boolean = true;
  dscnameblue: boolean = true;
  dscnamegray: boolean = false; 
  //apelido
  asclastgray: boolean = false;
  asclastblue: boolean = true;
  dsclastblue: boolean = true;
  dsclastgray: boolean = false; 
// srvicio
  ascservgray: boolean = false;
  ascservblue: boolean = true;
  dscservblue: boolean = true;
  dscservgray: boolean = false;  
  // concepto 
  ascconcepgray: boolean = false;
  ascconcepblue: boolean = true;
  dscconcepblue: boolean = true;
  dscconcepgray: boolean = false;   
    // monto 
  ascmontopgray: boolean = false;
  ascmontopblue: boolean = true;
  dscmontopblue: boolean = true;
  dscmontopgray: boolean = false;   
 // DialogDataExampleDialog 
  @ViewChild('cargaExcel') cargaExcel;
 // datepicker format
 @Output() date2: EventEmitter<any> = new EventEmitter<any>();
 // fechas limites
 minDate = new Date(2000, 0, 1);
 maxDate = new Date(2050, 0, 1);
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
  private debtsUpdate: DebtEdit = new DebtEdit();

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


  pagination1: boolean= false;
  pagination2: boolean= false;
  pagination3: boolean= false;
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
    private spinner: NgxSpinnerService,
    private el: ElementRef, 
    ) {

    }

    InputNombreCodigo(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
       // tslint:disable-next-line:max-line-length
       if (charCode > 31 && (charCode <= 47 || charCode >= 58) &&  (charCode <= 64 || charCode >= 90) &&  (charCode <= 96 || charCode >= 122)  ) {
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
    this.spinner.show("mySpinner", {
      type: "line-scale-party",
      size: "large",
      bdColor: "rgba(100,149,237, .8)",
      color: "white"
    });
   this.consultaDeuda();
   this.cargaExcel = false;
   
  }
/*
  validandoListado() {
    
    if (localStorage.getItem('tk') === null  ) {
      this.router.navigate(['/login']);
    } else {
      this.getDeuda();
    }
  }*/

  getDeudas(){

    if (localStorage.getItem('tk') === null  ) {
      this.router.navigate(['/login']);

  }else{
    this.spinner.show();
    console.log("SPINNER "+ this.spinner)
    this.debtsList = {
      count: 0,
      data: []
    };
    this.transactionService.getDeuda(this.filtro)
      .subscribe(debts => {
        this.debtsList = debts;   
                console.log("NUMERO PAGINA " + this.filtro.pageNumber)
                if(this.filtro.pageNumber <= 1){
                  this.pagination1= true;
                  this.pagination2= false;
                  this.pagination3= false;
                }
                if(this.filtro.pageNumber >= 2 && this.debtsList.data.length== 50){
                    this.pagination1=false;
                    this.pagination2= true;
                    this.pagination3= false;
                }
                if(this.filtro.pageNumber >= 2 && this.debtsList.data.length != 50 ){
                    this.pagination1=false;
                    this.pagination2= false;
                    this.pagination3=true;          
                }
    });
    this.spinner.hide();
    
  }

  }
  ceroRegistros(): boolean {
      if (localStorage.getItem('tk') === null ||  localStorage.getItem('tk') ===  '') {
        this.router.navigate(['/login']);
        return false;
      } else {
        if (this.transactionService.debtItems.count === 0) {
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

////ORDENAMIENTO OCULTAR LAS FLECHAS


  AscDesc(/*nro: number */columnName: string, asc: boolean) {
    // this.filtro.pageNumber = nro;
  this.ascFeEmisiongray  = false;
  this.ascFeEmisionblue   = true;
  this.descFeEmisionblue  = true;
  this.descFeEmisiongray = false;
  //fecha de vencimiento

  this.ascFeVctgray = false;
  this.ascFeVctblue = true;
  this.dscFeVctblue  = true;
  this.dscFeVctgray  = false;

  //codigicliente
  this.asccodgray  = false;
  this.asccodblue  = true;
  this.dsccodiblue = true;
  this.dsccodigray  = false;
  // name
  this.ascnamegray  = false;
  this.ascnameblue  = true;
  this.dscnameblue  = true;
  this.dscnamegray  = false; 
  //apelido
  this.asclastgray = false;
  this.asclastblue  = true;
  this.dsclastblue = true;
  this.dsclastgray  = false;
// srvicio
this.ascservgray  = false;
this.ascservblue = true;
this.dscservblue  = true;
this.dscservgray = false;
  // concepto 
  this.ascconcepgray  = false;
  this.ascconcepblue  = true;
  this.dscconcepblue  = true;
  this.dscconcepgray = false;
    // monto 
    this.ascmontopgray  = false;
    this.ascmontopblue = true;
    this.dscmontopblue  = true;
    this.dscmontopgray  = false;

    if (columnName === 'emissionDate' ) {
        if (asc === true) {
          this.ascFeEmisionblue  = false;
          this.ascFeEmisiongray= true;
          this.descFeEmisionblue =true;
          this.descFeEmisiongray = false;
        }else{ 
          this.descFeEmisionblue =false;
          this.descFeEmisiongray = true;
          this.ascFeEmisionblue  = true;
          this.ascFeEmisiongray= false;
        }
    }
    if(columnName === 'dueDate' ){
      if(asc === true){ 
        this.ascFeVctblue  = false;
        this.ascFeVctgray= true;
        this.dscFeVctblue =true;
        this.dscFeVctgray = false;
      }else{ 
        this.dscFeVctblue =false;
        this.dscFeVctgray = true;
        this.ascFeVctblue  = true;
        this.ascFeVctgray= false;
      }
  }
  if(columnName === 'code' ){
    if(asc === true) { 
      this.asccodblue  = false;
      this.asccodgray= true;
      this.dsccodiblue =true;
      this.dsccodigray = false;
    } else { 
      this.dsccodiblue =false;
      this.dsccodigray = true;
      this.asccodblue  = true;
      this.asccodgray= false;
    }
} 
if(columnName === 'firstName' ) {
  if(asc === true){ 
    this.ascnameblue  = false;
    this.ascnamegray= true;
    this.dscnameblue =true;
    this.dscnamegray = false;
  } else { 
    this.dscnameblue =false;
    this.dscnamegray = true;
    this.ascnameblue  = true;
    this.ascnamegray= false;
  }
}
if(columnName === 'lastName' ) {
  if(asc === true){ 
    this.asclastblue  = false;
    this.asclastgray= true;
    this.dsclastblue =true;
    this.dsclastgray = false;
  } else { 
    this.dsclastblue =false;
    this.dsclastgray = true;
    this.asclastblue  = true;
    this.asclastgray= false;
  }
}
if(columnName === 'service' ) {
  if(asc === true) { 
    this.ascservblue  = false;
    this.ascservgray= true;
    this.dscservblue =true;
    this.dscservgray = false;
  } else { 
    this.dscservblue =false;
    this.dscservgray = true;
    this.ascservblue  = true;
    this.ascservgray= false;
  }
}
if(columnName === 'concept' ) {
  if(asc === true) { 
    this.ascconcepblue  = false;
    this.ascconcepgray= true;
    this.dscconcepblue =true;
    this.dscconcepgray = false;
  } else { 
    this.dscconcepblue =false;
    this.dscconcepgray = true;
    this.ascconcepblue  = true;
    this.ascconcepgray= false;
  }
}
if(columnName === 'amount' ) {
  if(asc === true) { 
    this.ascmontopblue  = false;
    this.ascmontopgray= true;
    this.dscmontopblue =true;
    this.dscmontopgray = false;
  } else { 
    this.dscmontopblue =false;
    this.dscmontopgray = true;
    this.ascmontopblue  = true;
    this.ascmontopgray= false;
  }
}

    this.filtro.asc = asc;
    this.filtro.columnName = columnName;
   // this.filtro.dateFrom=; 
    // this.filtro.dateTo;
    this.consultaDeuda();

  }

  sendFiltro() {
    this.filtro.pageNumber = 1;
    this.consultaDeuda();
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
             
                this.spinner.show();
                this.debtsList = {
                  count: 0,
                  data: []
                };
                this.transactionService.getDeuda(this.filtro)
                  .subscribe(debts => {
                    console.log(debts);
                    this.selectedAll = false;
                    this.debtsList = debts;
                   this.spinner.hide();
                    console.log("NUMERO PAGINA " + this.filtro.pageNumber)
                    if(this.filtro.pageNumber <= 1){
                      this.pagination1= true;
                      this.pagination2= false;
                      this.pagination3= false;
                    }
                    if(this.filtro.pageNumber >= 2 && this.debtsList.data.length== 50){
                        this.pagination1=false;
                        this.pagination2= true;
                        this.pagination3= false;
                    }
                    if(this.filtro.pageNumber >= 2 && this.debtsList.data.length != 50 ){
                        this.pagination1=false;
                        this.pagination2= false;
                        this.pagination3=true;          
                    }

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
                      this.spinner.show();

                      this.debtsList = {
                        count: 0,
                        data: []
                      };
                      this.transactionService.getDeuda(this.filtro)
                        .subscribe(debts => {
                          console.log(debts);
                          this.debtsList = debts;
                       this.spinner.hide();
                         console.log("NUMERO PAGINA " + this.filtro.pageNumber)
                         if(this.filtro.pageNumber <= 1){
                           this.pagination1= true;
                           this.pagination2= false;
                           this.pagination3= false;
                         }
                         if(this.filtro.pageNumber >= 2 && this.debtsList.data.length== 50){
                             this.pagination1=false;
                             this.pagination2= true;
                             this.pagination3= false;
                         }
                         if(this.filtro.pageNumber >= 2 && this.debtsList.data.length != 50 ){
                             this.pagination1=false;
                             this.pagination2= false;
                             this.pagination3=true;          
                         }
                      });
                }
        }
         /// change
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
            this.spinner.show();

              this.debtsList = {
                count: 0,
                data: []
              };
              this.transactionService.getDeuda(this.filtro)
                .subscribe(debts => {
                  console.log(debts);
                  this.debtsList = debts;
                  console.log("NUMERO PAGINA " + this.filtro.pageNumber)
                  if(this.filtro.pageNumber <= 1){
                    this.pagination1= true;
                    this.pagination2= false;
                    this.pagination3= false;
                  }
                  if(this.filtro.pageNumber >= 2 && this.debtsList.data.length== 50){
                      this.pagination1=false;
                      this.pagination2= true;
                      this.pagination3= false;
                  }
                  if(this.filtro.pageNumber >= 2 && this.debtsList.data.length != 50 ){
                      this.pagination1=false;
                      this.pagination2= false;
                      this.pagination3=true;          
                  }
                this.spinner.hide();
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
       this.inputText.nativeElement.value = null;
       this.filtro.inputSearch = "";
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
     
 /*   let yearEmission  = parseInt(item.newEmissionDate.getFullYear().toString());
    console.log(yearEmission);
    let yearDua = parseInt(item.newDueDate.toString());  
    console.log(yearDua);

  if (yearEmission < 2000 ) {
      Swal.fire({
        type: 'error',
        text: 'Ingrese una fecha valida para la fecha de emision',
      });
      return;
    }
    if (yearDua > 2050 ) {
      Swal.fire({
        type: 'error',
        text: 'Ingrese una fecha valida para la fecha de emision',
      });
      return;
    }   */
  
    if (item.newEmissionDate == null) {
      Swal.fire({
        type: 'error',
        text: 'Ingrese la fecha de emision',
      });
      return;
    }
    if (item.newDueDate == null) {
      Swal.fire({
        type: 'error',
        text: 'Ingrese la fecha de vencimiento',
      });
      return;
    }
    if (item.newConcept === ''   ) {
      Swal.fire({
        type: 'error',
        text: 'Ingrese el concepto',
      });
      return;
    }
    if (item.newEmissionDate > item.newDueDate) {
      Swal.fire({
        type: 'error',
        text: 'La fecha de Emision no puede ser mayor a la fecha de vencimiento',
      });
      return;
    }

    Swal.fire({
      title: '¿Deseas Actualizar?',
      text: '¡No podrás revertir esto!',
      imageUrl: '/assets/images/complain.svg',   imageHeight: 100,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Editarlo!',
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.value) {

        item.edit = false;
        const debts = {
          emissionDate: item.newEmissionDate,
          dueDate: item.newDueDate,
          concept: item.newConcept
        };

        this.transactionService.editDeuda(item.id, debts).subscribe(
          debtsUpdate => {
            Swal.fire({
              type: 'success',
              titleText: 'Editado!',
              text: 'Su registro a sido editado',
              onAfterClose: () => {
                console.log('onAfterClose');
                item.emissionDate = item.newEmissionDate;
                item.dueDate = item.newDueDate;
                item.concept = item.newConcept;
                item.edit = false;
              }
            });
          }
        );

      }
    });

  }

  BotonCancela(item: Debts) {
    item.edit = false;
  }

  changePage(nro: number) {
    this.selectedAll = false;
    this.filtro.pageNumber = nro;
    this.numeroPagina = nro;
    this.consultaDeuda();
  }
  EliminarSeleccionados() {
    const itemsParaEliminar = [];
    this.debtsList.data.forEach(c => {
    if (c.selected) {
      itemsParaEliminar.push(c.id);
    }
    });

    if (itemsParaEliminar.length === 0 ) {
      Swal.fire({
        type: 'error',
        text: '¡Seleccione las filas a eliminar por favor!',
      });
      return;
    }

 Swal.fire({
      title: '¿Estas Seguro de Eliminar ' + itemsParaEliminar.length + ' registros?',
      text: '¡No podrás revertir esto!',
      imageUrl: '/assets/images/complain.svg',   imageHeight: 100, 
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo!',
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.value) {
        /*this.spinner2.show();*/
        
        this.transactionService.deleteAll(itemsParaEliminar)
          .subscribe(() => this.consultaDeuda());
         /* this.spinner2.hide();*/
          }
        });
  }



  Eliminar(item: Debts) {
     
  Swal.fire({
    title: "¿Esta Seguro de Eliminar el Registro?",
    imageUrl: '/assets/images/complain.svg',   imageHeight: 100,  
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Borralo',
    cancelButtonText: 'Cerrar',
  }).then((result) => {
    if (result.value) {
   /* this.spinner2.show();*/
      this.transactionService.deleteDeuda(item.id)
      .subscribe(() => this.consultaDeuda());
 /*   this.spinner2.hide();*/
    
    Swal.fire(
      'Eliminado!',
      'Tu archivo ha sido eliminado',
      'success'
    )
  }
})
}

  SeleccionarTodos() {
    console.log('selecctionarTodos');
    this.debtsList.data.forEach(itm => itm.selected = this.selectedAll);
    
  }

/*//////// O P E N  - D I A L O G ///////////////////// */
MostrarListaSelect() {
  this.OcultaListaExcel = true;
}

  openDialog(service: string) {
    this.OcultaListaExcel = false;
    this.cargaExcel = false;
    console.log('sale el pop up');
    this.excelService.service = service;
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {

    });
  }


}



