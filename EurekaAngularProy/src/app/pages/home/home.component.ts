import { Date } from './../../shared/models/date';
import { Component, OnInit, Directive, HostListener, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { Debts, DebtsPagedList } from 'src/app/shared/models/debts';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatDialog, MatSnackBar} from '@angular/material';
import { WayPay } from 'src/app/shared/models/way-pay';
import { Type } from 'src/app/shared/models/type';
import * as saveAs from 'file-saver';

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
import { LoginService } from 'src/app/shared/services/login.service';
import { drawPopup } from 'src/app/shared/services/popups';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { Observable, Subject } from 'rxjs';
import { isNgTemplate } from '@angular/compiler';
import { Popover } from './popover/popover.service';
import { PagosComponent } from './pagos/pagos.component';
import { LoadFileService } from 'src/app/shared/load-file/load-file.service';
import { LoadBarService } from 'src/app/shared/load-bar/load-bar.service';
import { DebtComponent } from './debt.component';
//// END DATE ////////////////////

const moment = _rollupMoment || _moment;

const MY_FORMATS = {
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


// tslint:disable-next-line:directive-class-suffix
export class HomeComponent implements OnInit {

  numeroPagina: number;

  orderDef = [
    { name: 'emissionDate', asc: false },
    { name: 'dueDate', asc: false },
    { name: 'code', asc: false },
    { name: 'firstName', asc: false },
    { name: 'lastName', asc: false },
    { name: 'Service', asc: false },
    { name: 'concept', asc: false },
    { name: 'amount', asc: false },
    { name: 'interestAmount', asc: false },
    { name: 'totalAmount', asc: false },
    { name: 'totalAmountPayed', asc: false },
    { name: 'status', asc: false }
  ]
  orderBy = -1;

 // DialogDataExampleDialog
  @ViewChild('cargaExcel', { static: true }) cargaExcel;
 // datepicker format
 @Output() date2: EventEmitter<any> = new EventEmitter<any>();
 // fechas limites
 minDate = new Date(2000, 0, 1);
 maxDate = new Date(2050, 0, 1);
 // inputDate1:string = '';  inputText
 @ViewChild('inputText', { static: true }) inputText: ElementRef;
 @ViewChild('inputDate1', { static: true }) inputDate1: ElementRef;
 @ViewChild('inputDate2', { static: true }) inputDate2: ElementRef;
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
  messagetablecode1: Boolean =false;
  messagetablecode2: Boolean =false;
  private debtsUpdate: DebtEdit = new DebtEdit();

  typeList: any[];
  waypayList: WayPay[];
  DateList: Date[];

  typeSelected: String;
  type: String[];

  wayPaySelected:  String;
  wayPay: String[];

  dateSelected: String;
  date: String[];

  serviceSelected: String;
  services: any[];

  // tslint:disable-next-line:no-inferrable-types
  selectedAll: boolean = true;
  selectedUniverse = false;

  selectedAtLeastOneDebt: boolean = false;

  statusOptions : Array<Object> = [
    {  option:'PENDIENTE', state: '1'},
    {  option:'PAGADO', state : '2'}
  ]

  colorStatus: string;

  showEdit: boolean = false;

  currentFiltro: DebstFilter = {
    pageNumber: 1,
    columnName: '',
    asc: true,
    inputSearch: '',
    service: '',
    status: '',
    dateForFilter: '',
    dateFrom: null,
    dateTo: null
  };
  filtro: DebstFilter = {
    pageNumber: 1,
    columnName: '',
    asc: true,
    inputSearch: '',
    service: '',
    status: '',
    dateForFilter: '',
    dateFrom: null,
    dateTo: null
  };
  errores: any = {};
  querySearch: boolean = false;
  control: any;
 // mensaje grila

  messageTable: string ='';
  showArrow: boolean = false;

  @ViewChild('fileLoad', { read: ViewContainerRef, static: true }) fileLoadContainer : ViewContainerRef;

  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    public transactionService: TransactionService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private popover: Popover,
    private gaService: GoogleAnalytics,
    private fileLoad: LoadFileService,
    private barLoad: LoadBarService) {
      transactionService.itemsForDelete = [];
    }
     /*
     @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
      e.preventDefault();
    }

    @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
      e.preventDefault();
    }

    @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
      e.preventDefault();
    }
    */
   innerHeight = 0;
    @HostListener('window:scroll', ['$event'])
    onWindowScroll(e) {
      let height = window.innerHeight;
      if (!height)
        height = document.documentElement.clientHeight;
      if (height !== this.innerHeight) {
        height -= 150;
        $('.ps-body .ps-content').css('height', height + 'px');
      }
    }

  ngOnInit() {
    this.fileLoad.onClose.subscribe(m => {
      console.log(m.status);
      if (m.status === 'completed') {
        this.consultaDeuda();
      }
      else if (m.status === 'rejected') {
        this.excelService.statusUpload = false;
        const dialogRef = this.dialog.open(DialogComponent,{
          width: '899px',
        });
        dialogRef.componentInstance.ready = true;
        dialogRef.componentInstance.rowsAccepted = m.rowsAccepted;
        dialogRef.componentInstance.rowsRejected = m.rowsRejected;
      }
    });
    this.fileLoad.verify(this.fileLoadContainer);
    this.user = this.storageService.getCurrentUser();
    this.loginService.refresh();
    this.homeService.getServices(true).subscribe(
      value => {
        this.services = value;
        this.serviceSelected = value[0];
      }
    );
    this.homeService.getServicesActive().subscribe(
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
   this.transactionService.debtItems = { data: [], countNoIbkPayments: 0, count : 0 };
   this.consultaDeuda();
   this.cargaExcel = false;

   // check
   //this.SeleccionarTodos();
   this.selectedAll = false;
   this.selectedUniverse = false;
  }

  statusOpt() {

  }
/*
  validandoListado() {

    if (sessionStorage.getItem('tk') === null  ) {
      this.router.navigate(['/login']);
    } else {
      this.getDeuda();
    }
  }*/



  ceroRegistros(): boolean {
      if (sessionStorage.getItem('tk') === null ||  sessionStorage.getItem('tk') ===  '') {
        //this.router.navigate(['/login']);
        return false;
      } else {
        if (this.transactionService.debtItems.count === 0) {
          return true;
      } else {
          return false;
      }
      }
  }

////ORDENAMIENTO OCULTAR LAS FLECHAS
orderList(index: number, asc: boolean) {
  this.orderBy = index;
  this.orderDef[index].asc = asc;

  this.currentFiltro.asc = asc;
  this.currentFiltro.columnName = this.orderDef[index].name;
  this.consultaDeuda();
}

  sendFiltro() {
    this.messagetablecode1 = false;
    this.messagetablecode2 = false;
    this.querySearch = true;
    //filtro
    this.currentFiltro.inputSearch = this.filtro.inputSearch;
    this.currentFiltro.service = this.filtro.service;
    this.currentFiltro.status = this.filtro.status;
    this.currentFiltro.dateForFilter = this.filtro.dateForFilter;
    this.currentFiltro.dateFrom = this.filtro.dateFrom;
    this.currentFiltro.dateTo = this.filtro.dateTo;
    this.currentFiltro.pageNumber = 1;
    //limpia anter
    this.selectedAll = false;
    this.selectedUniverse = false;
    this.transactionService.clearMarksForDeletes();
    this.consultaDeuda();
    // google analytics
    this.gaService.sendEvent('Buscar', {
      'event_category': 'Dashboard',
      'event_label': 'buscar'
    });
    if((this.filtro.inputSearch === '' || this.filtro.inputSearch === null || this.filtro.inputSearch === undefined) &&
       (this.filtro.service === '' || this.filtro.service === null || this.filtro.service === undefined)  &&
       (this.filtro.status == '' || this.filtro.status === null || this.filtro.status === undefined)  &&
       (this.filtro.dateForFilter == '' || this.filtro.dateForFilter === null || this.filtro.dateForFilter === undefined)){
       this.messageTable = 'Para empezar, agrega la lista de los cobros';
       this.showArrow = true;
      } else{
       this.messageTable ='No se encontró ningún registro para esta búsqueda';
       this.showArrow = false;

      }
  }

   mensaje(tipo: any, titulo: string, text: string){
    if (sessionStorage.getItem('tk') !== null  ) {
      this. mesageeError(tipo,titulo,text);
    }
  }

  mesageeError(tipo: any, titulo: string, text: string){
    Swal.fire({
      title: titulo ,
      html: text,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText:  'CANCELAR',
      onOpen: drawPopup
    });
  }




  validaFiltro(): boolean {

    let usDatePattern =  /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    //lenght date from
    var lenghtdf = new Date(this.filtro.dateFrom).toDateString().length;
    var fromdate = parseInt(new Date(this.filtro.dateFrom).toDateString().substr(lenghtdf-4, lenghtdf));
    // lenght to
    var lenghtdt = new Date(this.filtro.dateTo).toDateString().length;
    var todate = parseInt(new Date(this.filtro.dateTo).toDateString().substr(lenghtdt-4, lenghtdt));

    if (this.filtro.dateForFilter !== '' && this.filtro.dateForFilter !== null && this.filtro.dateForFilter !== undefined) {
      let faltaDesde: boolean = false;
      let faltaHasta: boolean = false;
      if (this.filtro.dateFrom === null && this.inputDate1.nativeElement.value === '') {
        faltaDesde = true;
      }
      if (this.filtro.dateTo === null && this.inputDate2.nativeElement.value === '') {
        faltaHasta = true;
      }
      let msg = faltaDesde ? 'La fecha "desde" no puede estar en blanco' : '';
      msg += faltaHasta ? (faltaDesde ? '<br />' : '') + 'La fecha "hasta" no puede estar en blanco' : '';
      if (faltaDesde || faltaHasta) {
        // tslint:disable-next-line:no-unused-expression
        this.filtro.dateFrom == null;
        // tslint:disable-next-line:no-unused-expression
        this.filtro.dateTo  == null;
        // this.mensaje( 'error', 'Error en la fecha',msg);
        return true;
      }
    }


    if (this.filtro.dateFrom === null &&  this.filtro.dateTo === null) {
      ///       dateFrom es inputDate1              | dateTo  es inputDate2
          if (this.inputDate1.nativeElement.value === '' &&  this.inputDate2.nativeElement.value === '') {


            if (this.filtro.dateFrom > this.filtro.dateTo   ) {
              // tslint:disable-next-line:no-unused-expression
              this.filtro.dateFrom == null;
              // tslint:disable-next-line:no-unused-expression
              this.filtro.dateTo  == null;
              this.mensaje( 'error', 'Error en la fecha','La fecha "desde" no puede ser mayor a la fecha "hasta"');
              return false;
            } else {
              return true;
            }
          } else {
                  if (!this.inputDate1.nativeElement.value.match(usDatePattern)) {
                   // this.mensaje( 'error', 'Error en la fecha','Ingrese correctamente fecha desde' );
                      // tslint:disable-next-line:no-unused-expression
                      this.filtro.dateFrom == null;
                      // tslint:disable-next-line:no-unused-expression
                      this.filtro.dateTo  == null;
                   return false;
                  }
                  if (!this.inputDate2.nativeElement.value.match(usDatePattern)) {
                   // this.mensaje( 'error', 'Error en la fecha','Ingrese correctamente la fecha hasta');
                    // tslint:disable-next-line:no-unused-expression
                    this.filtro.dateFrom == null;
                    // tslint:disable-next-line:no-unused-expression
                    this.filtro.dateTo  == null;
                   return false;
                  } else {
                    return true;
                  }
          }
           /// change
        } else {
            if ( this.inputDate1.nativeElement.value === '') {
               // this.mensaje( 'error', 'Error en la fecha','La fecha "desde" no puede estar en blanco');
               // tslint:disable-next-line:no-unused-expression
               this.filtro.dateFrom == null;
               // tslint:disable-next-line:no-unused-expression
               this.filtro.dateTo  == null;
               return false;
            } else if ( this.inputDate2.nativeElement.value === '') {
              // tslint:disable-next-line:no-unused-expression
              this.filtro.dateFrom == null;
              // tslint:disable-next-line:no-unused-expression
              this.filtro.dateTo  == null;
              //  this.mensaje( 'error', 'Error en la fecha','La fecha "hasta" no puede estar en blanco');
                return false;
            } else if ( !this.inputDate1.nativeElement.value.match(usDatePattern)) {
              // tslint:disable-next-line:no-unused-expression
              this.filtro.dateFrom == null;
              // tslint:disable-next-line:no-unused-expression
              this.filtro.dateTo  == null;
               // this.mensaje( 'error', 'Error en la fecha','ingrese correctamente la fecha desde');
                return false;
            } else if ( !this.inputDate2.nativeElement.value.match(usDatePattern)) {
              // tslint:disable-next-line:no-unused-expression
              this.filtro.dateFrom == null;
              // tslint:disable-next-line:no-unused-expression
              this.filtro.dateTo  == null;
              // this.mensaje( 'error', 'Error en la fecha','ingrese correctamente la fecha hasta');
              return false;
            }

            else if (fromdate <  2000 || fromdate >  2050 ) {
              this.mensaje( 'error', 'Error en la fecha','Ingrese un Año valido para la fecha de Emision');
              return false;
            }

            else if (todate <  2000 || todate >  2050 ) {
              this.mensaje( 'error', 'Error en la fecha','Ingrese un Año valido  para la fecha de Vencimiento');
              return false;
            }
            else if (this.filtro.dateFrom > this.filtro.dateTo ) {
              this.mensaje( 'error', 'Error en la fecha','La fecha "desde" no puede ser mayor a la fecha "hasta"');
              return false;
            } else {

              return true;
           }
    }

  }

  private validaFiltro2() {
    let res: boolean = true;
    for(var s in this.errores) {
      if (this.errores[s])
        res = false;
    }
    return res;
  }

  consultaDeuda(cb: () => void = null) {
  // tslint:disable-next-line:prefer-const

    if (this.validaFiltro2()){
                this.spinner.show();
                this.transactionService.getDeuda(this.currentFiltro, this.selectedUniverse)
                  .subscribe(debts => {
                  if(this.transactionService.debtItems.data.length > 0){
                    this.selectedAll = this.transactionService.isMarkedAll(this.selectedUniverse);
                  }

                  //this.selectedUniverse = false;
                  this.spinner.hide();
                  if (cb) {
                    cb();
                  }
                }, err => { this.spinner.hide(); });
          }
     this.messageTable = 'Para empezar, agrega la lista de las deudas';
     this.showArrow = true;

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
      if (this.filtro.dateForFilter)
        this.errores.dateFrom = 'Ingrese una fecha';
      else
        delete this.errores.dateFrom;
    }

    limpiardate2() {
      this.inputDate2.nativeElement.value = '';
      this.filtro.dateTo = null;
      if (this.filtro.dateForFilter)
        this.errores.dateTo = 'Ingrese una fecha';
      else
        delete this.errores.dateTo;
    }


  BotonEditar(item: Debts) {
    item.editInput =true;
    item.editButton = true;
    item.editPending = (item.status === 'PENDIENTE' || (item.status === 'VENCIDO' && item.amountPayed === 0));
    item.newStatus =  '1';
    item.newDueDate = item.dueDate;
    item.newEmissionDate = item.emissionDate;
    item.newConcept = item.concept;
    item.newAmount = item.amount.toFixed(2);
    item.newFirstName = item.firstName;
    item.newLastName = item.lastName;
  }

  selectEstPag(event, item: Debts){
    if(event == '1'){
      item.editInput = true;
      item.editPending = true;
    }
    if(event == '2'){
      item.editInput = false;
      item.editPending = false;
    }

  }

  clearDatePicker(event){
    if(event){
      this.errores['dateFrom'] = 'Ingrese una fecha';
      this.errores['dateTo'] = 'Ingrese una fecha';
    }
    else {
      this.limpiardate1();
      this.limpiardate2();
      this.querySearch = false;
      delete this.errores.dateFrom;
      delete this.errores.dateTo;
    }
  }


  BotonActualizar(item: Debts) {

    this.validaEmissionDate(item);
    if (item.dueDate) {
      this.validaDueDate(item);
      this.validaMonto(item);
    }
    this.validaNombresApellidos(item);

    for(var s in item.errores) {
      if (item.errores[s])
        return;
    }

    Swal.fire({
      title: '¿Deseas actualizar?',
      text: '¡No podrás revertir esto!',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'SI, ACTUALIZAR',
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup
    }).then((result) => {

      if (result.value) {
      //  item.edit = false;
        const debts = {
          emissionDate: item.newEmissionDate,
          dueDate: item.newDueDate,
          concept: item.newConcept,
          amount: parseFloat(item.newAmount.toString()),
          firstName: item.newFirstName,
          lastName: item.newLastName
        };


  if(item.newStatus==='1'){

        this.transactionService.editDeuda(item.id, debts).subscribe(
          debtsUpdate => {
            if (debtsUpdate.success) {
              this.gaService.sendEvent('EditarDeuda', {
                'event_category': 'Dashboard',
                'event_label': 'editar_deuda'
              });
              Swal.fire({
                titleText: 'Editado',
                text: 'Su registro ha sido editado',
                showCloseButton: true,
                showCancelButton: false,
                onOpen: drawPopup,
                onAfterClose: () => {
                  this.consultaDeuda();
                }
              });
            }
            else {
              Swal.fire({
                titleText: 'ERROR',
                text: debtsUpdate.message,
                showCloseButton: true,
                showCancelButton: false,
                onOpen: drawPopup
              });
            }
          }
        );

      }else if(item.newStatus==='2'){
          let boolean= false;
          this.transactionService.updateDeuda(item.id, true).subscribe(
            statusUpdate=>{
              Swal.fire({
                titleText: 'Editado',
                text: 'Su registro a sido editado',
                showCloseButton: true,
                showCancelButton: false,
                onOpen: drawPopup,
                onAfterClose: () => {
                  item.status= 'PAGADO';
                  item.amountPayed = statusUpdate.payed;
                  item.payDate = new Date();
                  item.channel = 'Efectivo';
                  this.showEdit = true;
                  // item.edit = false;
                  item.newStatus = null;
                  item.editInput =false;
                  item.editButton = false;
                  item.editPending = false;
                }});
              }
          );
        }
    }
  });

}




  BotonCancela(item: Debts) {
   //  item.edit = false;
   item.editInput = false;
   item.editButton = false;
   item.editPending = false;
   console.log('limpia errores ');
   delete item.errores.dueDate;
   delete item.errores.emissionDate;
   delete item.errores.lastName;
   delete item.errores.amount;
   delete item.errores.firstName;

  }

  changePage(nro: number) {
    this.currentFiltro.pageNumber = nro;
    this.numeroPagina = nro;
    this.consultaDeuda();
    this.selectedAll = this.transactionService.isMarkedAll(this.selectedUniverse);
    this.DebtsAreSelected();
  }


  EliminarSeleccionados() {
    let totalForDelete = this.selectedUniverse ? this.transactionService.debtItems.countNoIbkPayments : this.transactionService.countMarksForDelete();
    if (totalForDelete === 0 ) {
      this.mensaje( 'error', 'Eliminar cobros', 'Seleccione los cobros a eliminar por favor');
      return;
    }
    let mensaje='';
    let mensaje_final ='';
    if (totalForDelete === 1 ) {
      mensaje = `Esta acción va a eliminar ${totalForDelete} deuda`;
    }
    if (totalForDelete > 1 ) {
      mensaje = `Esta acción va a eliminar ${totalForDelete} deudas`;
    }

    Swal.fire({
      title: '¿Seguro que deseas continuar?',
      text: mensaje,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      onOpen: drawPopup
    }).then((result) => {
      if (result.value) {
        this.spinner.show();

        let observable = this.selectedUniverse ?
          this.transactionService.deleteFiltered(this.filtro):
          this.transactionService.deleteAll();
        observable.subscribe(() => {
          this.gaService.sendEvent('EliminarDeudas', {
            'event_category': 'Dashboard',
            'event_label': 'eliminar_deudas'
          });
            this.consultaDeuda(() =>
              {
                if (totalForDelete === 1 ) {
                  mensaje_final = 'Se han eliminado ' + totalForDelete + ' registro';
                }
                if (totalForDelete > 1 ) {
                  mensaje_final = 'Se han eliminado ' + totalForDelete + ' registros';
                }

                Swal.fire({
                  title: 'Eliminado',
                  text: mensaje_final,
                  showCloseButton: true,
                  showCancelButton: false,
                  confirmButtonText: 'CERRAR',
                  onOpen: drawPopup
                })


              });
              this.selectedAll = false;
              this.selectedUniverse = false;

              this.transactionService.debtItems.data = [];
              this.transactionService.itemsForDelete = [];

              console.log('arra limpio');

              console.log(totalForDelete)
          }, err => { this.spinner.hide(); });
      }
    });
    console.log('arra limpio');
    this.DebtsAreSelected();
  }



  Eliminar(item: Debts) {

  Swal.fire({
    title: "¿Esta Seguro de Eliminar el Registro? ",
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonText: 'SI, BORRALO',
    cancelButtonText: 'CERRAR',
    onOpen: drawPopup
  }).then((result) => {
    if (result.value) {
      this.spinner.show();
      this.transactionService.deleteDeuda(item.id)
      .subscribe(() => this.consultaDeuda(() =>
      {
        Swal.fire(
          'Eliminado',
          'Tu registro ha sido eliminado',
          'success'
        )
      }), err => { this.spinner.hide(); });
    }
  });
  this.DebtsAreSelected();
  }

  SeleccionarTodos() {

    if (this.selectedAll) {
      this.transactionService.debtItems.data.forEach(itm => {
        if (!itm.hasIBKPayments && itm.status !== 'PAGADO') {
          this.transactionService.deleteDebt(itm.id, itm.selected = true);
        }
      });
    }
    else {
      this.selectedUniverse = false;
      this.transactionService.debtItems.data.forEach(itm => this.transactionService.deleteDebt(itm.id, itm.selected = false));
    }
    this.DebtsAreSelected();
  }

/*//////// O P E N  - D I A L O G ///////////////////// */
MostrarListaSelect() {
  this.OcultaListaExcel = true;
}
Ocultar() {
  if (this.OcultaListaExcel === true) {
   //  this.OcultaListaExcel = false;
  }

}

  openDialog(service: any) {
    this.fileLoad.close();
    this.OcultaListaExcel = false;
    this.cargaExcel = false;
    this.excelService.service = service;
    const dialogRef = this.dialog.open(DialogComponent,{
      width: '899px',
     // height: '377px',
     // disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: Observable<any>) => {
      dialogRef.componentInstance.ready = false;
      this.fileLoad.verify(this.fileLoadContainer);
      if (result) {
        result.subscribe(() => {
          this.consultaDeuda();
        });
      }
    });
  }

  public enDescarga: boolean = false;

  DescargarReporte() {
    if (this.enDescarga === false) {
      if( this.transactionService.debtItems.data.length > 0){
        if (this.validaFiltro()) {
          this.enDescarga = true;
          this.barLoad.show(this.fileLoadContainer);
          this.transactionService.report(this.currentFiltro)
          .subscribe((r: Blob) => {
            this.gaService.sendEvent('DescargaReporte', {
              'event_category': 'Dashboard',
              'event_label': 'descargar_reporte'
            });
            this.barLoad.close();
            this.enDescarga = false;
            saveAs(r, "Reporte - Interbank_MisCobros.xlsx");
          }, err => {
            this.barLoad.close();
            this.enDescarga = false;
            this.mensaje('error', 'Descarga','No se pudo descargar el reporte');
          });
        }
      }else{
        this.mensaje('warning', 'Descarga','No tiene registros para descargar');
      }
    }
  }

  estaVencido(itm: Debts): boolean{
    let today = new Date();
    let resp = (itm.status === 'PENDIENTE' || itm.status === 'PARCIAL') && (itm.dueDate !== null) && (itm.dueDate < today);
    return resp;
  }

  MontoBlur(e) {
    let initalValue = parseFloat(e.newAmount);
    if(!isNaN(initalValue))
      e.newAmount = initalValue.toFixed(2);
  }

  change(dateEvent) {
    this.date2.emit(dateEvent.value);
  }

  limpiarDateForFilter() {
    this.filtro.dateForFilter=null;
    this.limpiardate1();
    this.limpiardate2();
    this.querySearch = false;
  }

  private internalValidaDateFrom(e) {
    if (e === null) {
      this.errores['dateFrom'] = 'No es una fecha válida';
    }
    else {
      let yearFrom = new Date(e).getFullYear();
      if (yearFrom <  2000 || yearFrom >  2050 ) {
        this.errores['dateFrom'] = 'Fecha Inválida';
      }
      else {
        delete this.errores.dateFrom;
      }
    }
  }

  private internalValidaDateTo(e) {
    if (e === null) {
      this.errores['dateTo'] = 'No es una fecha válida';
    }
    else {
      let yearTo = new Date(e).getFullYear();
      if (yearTo <  2000 || yearTo >  2050 ) {
        this.errores['dateTo'] = 'Fecha Inválida';
      }
      else if (this.filtro.dateFrom && e < this.filtro.dateFrom) {
        this.errores['dateTo'] = "No puede ser menor a la emisión"
      }
      else {
        delete this.errores.dateTo;
      }
    }
  }

  validaDateFrom(e) {
    this.internalValidaDateFrom(e);
    if (!this.errores.dateFrom && this.filtro.dateTo) {
      this.internalValidaDateTo(this.filtro.dateTo);
    }
  }

  validaDateTo(e) {
    this.internalValidaDateTo(e);
    if (!this.errores.dateTo && this.filtro.dateFrom) {
      this.internalValidaDateFrom(this.filtro.dateFrom);
    }
  }

  validaEmissionDate(items: Debts) {
    if (!items.newEmissionDate) {
      items.errores.emissionDate = 'Fecha Inválida';
    }
    else {
      let emidate = new Date(items.newEmissionDate).getFullYear();
      if (emidate <  2000 || emidate >  2050 ) {
        items.errores.emissionDate = 'Fecha Inválida';
      }
      else {
        delete items.errores.emissionDate;
      }
    }
  }

  validaDueDate(items: Debts) {
    if (!items.newDueDate) {
      items.errores.dueDate = 'Fecha Inválida';
    }
    else {
      let dueyear = new Date(items.newDueDate).getFullYear();
      if (dueyear <  2000 || dueyear >  2050 ) {
        items.errores.dueDate = 'Fecha Inválida';
      }
      else if (items.newEmissionDate && items.newDueDate < items.newEmissionDate) {
        items.errores.dueDate = 'No debe ser menor a la fecha de emisión';
      }
      else {
        delete items.errores.dueDate;
      }
    }
  }

  private internalValidaNombres(items: Debts){
    if (items.newFirstName) {
      const re = new RegExp("^[ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]+$");
      if (items.newFirstName.length < 3) {
        items.errores.firstName = 'Debe tener 3 carácteres como mínimo';
      }
      else if (!re.test(items.newFirstName)) {
        items.errores.firstName = 'No cumple con el formato';
      }
      else {
        delete items.errores.firstName;
      }
    }
    else if (!items.newLastName) {
      items.errores.firstName = 'Debe ingresar un valor'
    }
    else {
      delete items.errores.firstName;
    }
  }

  private internalValidaApellidos(items: Debts) {
    if (items.newLastName) {
      const re = new RegExp("^[ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]+$");
      if (items.newLastName.length < 3) {
        items.errores.lastName = 'Deben tener 3 carácteres como mínimo';
      }
      else if (!re.test(items.newLastName)) {
        items.errores.lastName = 'No cumple con el formato';
      }
      else {
        delete items.errores.lastName;
      }
    }
    else {
      delete items.errores.lastName;
    }
  }

  validaNombresApellidos(items: Debts) {
    this.internalValidaNombres(items);
    this.internalValidaApellidos(items);
  }

  validaMonto(items:Debts) {
      let amount = parseFloat(items.newAmount);
      if (!amount) {
        items.errores.amount = 'Debe ingresar un valor';
      }
      else if (amount < 1) {
        items.errores.amount = 'Ingrese un monto válido';
      }
      else if (amount > 999999999.99) {
        items.errores.amount = 'Ingrese un monto válido'
      }
      else {
        delete items.errores.amount;
      }
  }

  selectForDelete(itm: Debts) {
    this.transactionService.deleteDebt(itm.id, itm.selected);
    this.selectedAll = this.transactionService.isMarkedAll();
    this.DebtsAreSelected();
  }

  showPopover(itm: any, origin) {
    let ref = this.popover.open({
      origin,
      content: PagosComponent,
      data: {
        debtId: itm.id,
        status: itm.status,
        currency: itm.currency
      }
    });
    ref.statusChange$.subscribe(d => {
      itm.status = d.data;
    });
  }

  DebtsAreSelected(){
    this.selectedAtLeastOneDebt = (this.transactionService.itemsForDelete.length > 0);
    console.log('ItemsForDelete',this.transactionService.itemsForDelete);
    console.log('this.selectedAtLeastOneDebt ',this.selectedAtLeastOneDebt);
  }

  CleanAllFilters(){
    this.filtro.inputSearch='';
    this.filtro.service=null;
    this.filtro.status=null;
    this.limpiarDateForFilter();
  }

  public agregandoDeuda: boolean = false;
  public newPartial: boolean = false;
  public nuevaDeuda: any = {
    errores: {}
  };

  AgregarDeuda() {
    if (this.services == null || this.services.length == 0) {
      this.mensaje( 'error', 'Agregar Deuda', 'No tiene servicios configurados');
      return;
    }
    let dlg = this.dialog.open(DebtComponent, {
      width: '300px'
    });
    dlg.afterClosed().subscribe(r => {
      if (r && r.grabado) {
        this.consultaDeuda();
      }
    });
  }

  cancelaNuevo() {
    this.agregandoDeuda = false;
    this.nuevaDeuda = { errores: {} };
  }

  grabarNuevo() {
    if (!this.nuevaDeuda.emissionDate) {
      this.nuevaDeuda.errores.emissionDate = 'Fecha Inválida';
    }
    else {
      let emidate = new Date(this.nuevaDeuda.emissionDate).getFullYear();
      if (emidate <  2000 || emidate >  2050 ) {
        this.nuevaDeuda.errores.emissionDate = 'Fecha Inválida';
      }
      else {
        delete this.nuevaDeuda.errores.emissionDate;
      }
    }

    if (this.newPartial) {
      if (!this.nuevaDeuda.dueDate) {
        this.nuevaDeuda.errores.dueDate = 'Fecha Inválida';
      }
      else {
        let dueyear = new Date(this.nuevaDeuda.dueDate).getFullYear();
        if (dueyear <  2000 || dueyear >  2050 ) {
          this.nuevaDeuda.errores.dueDate = 'Fecha Inválida';
        }
        else if (this.nuevaDeuda.emissionDate && this.nuevaDeuda.dueDate < this.nuevaDeuda.emissionDate) {
          this.nuevaDeuda.errores.dueDate = 'No debe ser menor a la fecha de emisión';
        }
        else {
          delete this.nuevaDeuda.errores.dueDate;
        }
      }

      if (this.nuevaDeuda.code) {
        const re = new RegExp("^[0-9a-zA-Z]+$");
        if (this.nuevaDeuda.code.length < 1) {
          this.nuevaDeuda.errores.code = 'Debe tener 1 carácter como mínimo';
        }
        else if (!re.test(this.nuevaDeuda.code)) {
          this.nuevaDeuda.errores.code = 'No cumple con el formato';
        }
        else {
          delete this.nuevaDeuda.errores.code;
        }
      }
      else if (!this.nuevaDeuda.code) {
        this.nuevaDeuda.errores.code = 'Debe ingresar un valor'
      }
      else {
        delete this.nuevaDeuda.errores.code;
      }

      if (this.nuevaDeuda.concept) {
        const re = new RegExp("^[0-9a-zA-Z]+$");
        if (this.nuevaDeuda.concept.length < 1) {
          this.nuevaDeuda.errores.concept = 'Debe tener 1 carácter como mínimo';
        }
        else if (!re.test(this.nuevaDeuda.concept)) {
          this.nuevaDeuda.errores.concept = 'No cumple con el formato';
        }
        else {
          delete this.nuevaDeuda.errores.concept;
        }
      }
      else if (!this.nuevaDeuda.concept) {
        this.nuevaDeuda.errores.concept = 'Debe ingresar un valor'
      }
      else {
        delete this.nuevaDeuda.errores.concept;
      }

      let amount = parseFloat(this.nuevaDeuda.amount);
      if (!amount) {
        this.nuevaDeuda.errores.amount = 'Debe ingresar un valor';
      }
      else if (amount < 1) {
        this.nuevaDeuda.errores.amount = 'Ingrese un monto válido';
      }
      else if (amount > 999999999.99) {
        this.nuevaDeuda.errores.amount = 'Ingrese un monto válido'
      }
      else {
        delete this.nuevaDeuda.errores.amount;
      }
    }

    if (this.nuevaDeuda.firstName) {
      const re = new RegExp("^[ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]+$");
      if (this.nuevaDeuda.firstName.length < 3) {
        this.nuevaDeuda.errores.firstName = 'Debe tener 3 carácteres como mínimo';
      }
      else if (!re.test(this.nuevaDeuda.firstName)) {
        this.nuevaDeuda.errores.firstName = 'No cumple con el formato';
      }
      else {
        delete this.nuevaDeuda.errores.firstName;
      }
    }
    else if (!this.nuevaDeuda.lastName) {
      this.nuevaDeuda.errores.firstName = 'Debe ingresar un valor'
    }
    else {
      delete this.nuevaDeuda.errores.firstName;
    }

    for(var s in this.nuevaDeuda.errores) {
      if (this.nuevaDeuda.errores[s])
        return;
    }

    Swal.fire({
      title: 'Nueva Deuda',
      text: '¿Deseas continuar?',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'SI, GRABAR',
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup
    }).then(result => {
      if (result.value) {
        let debt: any;
        if (this.newPartial) {
          debt = {
            emissionDate: this.nuevaDeuda.emissionDate,
            code: this.nuevaDeuda.code,
            firstName: this.nuevaDeuda.firstName,
          };
        }
        else {
          debt = {
            emissionDate: this.nuevaDeuda.emissionDate,
            dueDate: this.nuevaDeuda.dueDate,
            code: this.nuevaDeuda.code,
            firstName: this.nuevaDeuda.firstName,
            concept: this.nuevaDeuda.concept,
            amount: this.nuevaDeuda.amount
          };
        }
        this.homeService.postNewDebt(this.nuevaDeuda.service, debt)
          .subscribe(_ => {
            this.agregandoDeuda = false;
            this.nuevaDeuda = { errores: {} };
            this.consultaDeuda();
          });
      }
    });
  }

  cmbNewService() {
    let svc = this.services.find(s => s.name === this.nuevaDeuda.service);
    this.newPartial = (svc.dataType === 'P');
  }

  buscarNewCode() {
    this.homeService.getDebtorCode(this.nuevaDeuda.service, this.nuevaDeuda.code)
      .subscribe(d => {
        if (d.id) {
          this.nuevaDeuda.firstName = d.firstName;
        }
      });
  }
}



