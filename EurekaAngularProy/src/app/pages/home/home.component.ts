import { Date } from './../../shared/models/date';
import { Component, OnInit, Directive, HostListener, ElementRef, ViewChild} from '@angular/core';
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
    { name: 'amount', asc: false },
    { name: 'interestAmount', asc: false },
    { name: 'totalAmount', asc: false },
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


  statusOptions : Array<Object> = [
    {  option:'PENDIENTE', state: '1'},
    {  option:'PAGADO', state : '2'}
  ]

  colorStatus: string;

  showEdit: boolean = false;

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
 // mensaje grila

  messageTable: string ='';

  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    public transactionService: TransactionService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private el: ElementRef) {

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



   this.transactionService.debtItems = { data: [], count : 0 };
   this.consultaDeuda();
   this.cargaExcel = false;

   // check
   //this.SeleccionarTodos();
   this.selectedAll = false;

  }

  statusOpt(){

  }
/*
  validandoListado() {

    if (localStorage.getItem('tk') === null  ) {
      this.router.navigate(['/login']);
    } else {
      this.getDeuda();
    }
  }*/



  ceroRegistros(): boolean {
      if (localStorage.getItem('tk') === null ||  localStorage.getItem('tk') ===  '') {
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

/*//////// C R U D ///////////////////// */
// datepiecker format
change(dateEvent) {
  this.date2.emit(dateEvent.value);
}

////ORDENAMIENTO OCULTAR LAS FLECHAS
orderList(index: number, asc: boolean) {
  this.orderBy = index;
  this.orderDef[index].asc = asc;

  this.filtro.asc = asc;
  this.filtro.columnName = this.orderDef[index].name;
  this.consultaDeuda();
}

  sendFiltro() {
    this.filtro.pageNumber = 1;
    this.consultaDeuda();

    if((this.filtro.inputSearch === '' || this.filtro.inputSearch === null || this.filtro.inputSearch === undefined) &&
       (this.filtro.service === '' || this.filtro.service === null || this.filtro.service === undefined)  &&
       (this.filtro.status == '' || this.filtro.status === null || this.filtro.status === undefined)  &&
       (this.filtro.dateForFilter == '' || this.filtro.dateForFilter === null || this.filtro.dateForFilter === undefined)){
       this.messageTable = ' Para empezar, carga las deudas de tus clientes';
      } else{
        this.messageTable ='No se encontro ningun registro para esta busqueda';
      }
  }

   mensaje(tipo: any, titulo: string, text: string){
    if (localStorage.getItem('tk') !== null  ) {
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
      confirmButtonText:  'Cerrar',
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
        this.mensaje( 'error', 'Error en la fecha',msg);
        return false;
      }
    }


    if (this.filtro.dateFrom === null &&  this.filtro.dateTo === null) {
      ///       dateFrom es inputDate1              | dateTo  es inputDate2
          if (this.inputDate1.nativeElement.value === '' &&  this.inputDate2.nativeElement.value === '') {


            if (this.filtro.dateFrom > this.filtro.dateTo   ) {
              this.mensaje( 'error', 'Error en la fecha','La fecha "desde" no puede ser mayor a la fecha "hasta"');
              return false;
            } else {
              return true;
              }
          } else {
                  if (!this.inputDate1.nativeElement.value.match(usDatePattern)) {
                    this.mensaje( 'error', 'Error en la fecha','Ingrese correctamente fecha desde' );
                    return false;
                  }
                  if (!this.inputDate2.nativeElement.value.match(usDatePattern)) {
                    this.mensaje( 'error', 'Error en la fecha','Ingrese correctamente la fecha hasta');
                    return false;
                  } else {
                    return true;
                  }
          }
           /// change
        } else {
            if ( this.inputDate1.nativeElement.value === '') {
                this.mensaje( 'error', 'Error en la fecha','La fecha "desde" no puede estar en blanco');
                return false;
            } else if ( this.inputDate2.nativeElement.value === '') {
                this.mensaje( 'error', 'Error en la fecha','La fecha "hasta" no puede estar en blanco');
                return false;
            } else if ( !this.inputDate1.nativeElement.value.match(usDatePattern)) {
                this.mensaje( 'error', 'Error en la fecha','ingrese correctamente la fecha desde');
                return false;
            } else if ( !this.inputDate2.nativeElement.value.match(usDatePattern)) {
              this.mensaje( 'error', 'Error en la fecha','ingrese correctamente la fecha hasta');
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

  consultaDeuda(cb: () => void = null) {
  // tslint:disable-next-line:prefer-const

    if (this.validaFiltro()){
                this.spinner.show();
                this.transactionService.getDeuda(this.filtro)
                  .subscribe(debts => {
                  this.selectedAll = false;
                  this.spinner.hide();
                  if (cb) {
                    cb();
                  }
                }, err => { this.spinner.hide(); });
          }
     this.messageTable = ' Para empezar, carga las deudas de tus clientes';

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
    item.editInput =true;
    item.editButton = true;
    item.editPending = (item.status === 'PENDIENTE');
    item.newStatus =  '1';
    item.newDueDate = item.dueDate;
    item.newEmissionDate = item.emissionDate;
    item.newConcept = item.concept;
    item.newAmount = item.amount;
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
    if(event == ''){
      this.limpiardate1();
      this.limpiardate2();
    }

  }


  BotonActualizar(item: Debts) {
    // MONTO
    if(item.newStatus==='1') {
      if(item.newAmount.toString() ==='' ||item.newAmount.toString() === null){
        this.mensaje( 'error', 'Error en el monto','Ingrese un Monto');
        return;
      }
      if(item.newAmount.toString().length < 1){
        this.mensaje( 'error', 'Error en el monto','Ingrese un Monto correcto');
        return;
      }
      if(parseInt(item.newAmount.toString()) < 1){
        this.mensaje( 'error', 'Error en el monto','Ingrese un Monto correcto');
        return;
      }

      if(!item.newAmount.toString().match(/^[0-9]{1,9}([.][0-9]{0,2})?$/)){
        this.mensaje( 'error', 'Error en el monto','Ingrese un Monto valido minimo de 1 y maximo de 9 caracteres enteros y 2 decimales como maximo');
        return;
      }

      /// EMISION DATE
      var lenghted = new Date(item.newEmissionDate).toDateString().length;
      var emidate = parseInt(new Date(item.newEmissionDate).toDateString().substr(lenghted-4, lenghted));
      /// DUE DATE
      var lenghtdd = new Date(item.newDueDate).toDateString().length;
      var duadate = parseInt(new Date(item.newDueDate).toDateString().substr(lenghtdd-4, lenghtdd));

      if (emidate <  2000 || emidate >  2050 ) {
        this.mensaje( 'error', 'Error en la fecha','Ingrese una fecha valida para la fecha de Emision');
        return;
      }

      if (duadate <  2000 || duadate >  2050 ) {
        this.mensaje( 'error', 'Error en la fecha','Ingrese una fecha valida para la fecha de Vencimiento');
        return;
      }

      if(item.newConcept.length <  8) {
        this.mensaje( 'error', 'Error en el Concepto','El concepto tiene que tener como minimo 8 digitos');
        return;
      }

      if(item.newConcept === null || item.newConcept === ""){
        this.mensaje( 'error', 'Error en el Concepto','Ingrese El concepto');
        return;
      }
      if (item.newEmissionDate == null) {
        this.mensaje( 'error', 'Error en la fecha','Ingrese la fecha de emision');
        return;
      }
      if (item.newDueDate == null) {
        this.mensaje( 'error', 'Error en la fecha','Ingrese la fecha de vencimiento');
        return;
      }
      if (item.newConcept === '') {
        this.mensaje( 'error', 'Error en el Concepto','Ingrese el concepto');
        return;
      }

      if (item.newEmissionDate > item.newDueDate) {
        this.mensaje( 'error', 'Error en la fecha','La fecha de Emision no puede ser mayor a la fecha de vencimiento');
        return;
      }
    }

    Swal.fire({
      title: '¿Deseas Actualizar?',
      text: '¡No podrás revertir esto!',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Si, Actualizar!',
      cancelButtonText: 'Cerrar',
      onOpen: drawPopup
    }).then((result) => {

      if (result.value) {
      //  item.edit = false;
        const debts = {
          emissionDate: item.newEmissionDate,
          dueDate: item.newDueDate,
          concept: item.newConcept,
          amount: parseFloat(item.newAmount.toString()),

        };


  if(item.newStatus==='1'){

        this.transactionService.editDeuda(item.id, debts).subscribe(
          debtsUpdate => {
            if (debtsUpdate.success) {
              Swal.fire({
                titleText: 'Editado!',
                text: 'Su registro a sido editado',
                showCloseButton: true,
                showCancelButton: false,
                onOpen: drawPopup,
                onAfterClose: () => {
                  item.status = debtsUpdate.status;
                  item.emissionDate = item.newEmissionDate;
                  item.dueDate = item.newDueDate;
                  item.concept = item.newConcept;
                  item.amount  = item.newAmount;
                 // item.edit = false;
                 item.editInput =false;
                 item.editButton = false;
                 item.editPending = false;
                 item.newStatus = '1';
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
                titleText: 'Editado!',
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
  })

}




  BotonCancela(item: Debts) {
   //  item.edit = false;
   item.editInput =false;
   item.editButton = false;
   item.editPending = false;
  }

  changePage(nro: number) {
    this.selectedAll = false;
    this.filtro.pageNumber = nro;
    this.numeroPagina = nro;
    this.consultaDeuda();
  }


  EliminarSeleccionados() {
    const itemsParaEliminar = [];
    this.transactionService.debtItems.data.forEach(c => {
    if (c.selected) {
      itemsParaEliminar.push(c.id);
    }
    });

    if (itemsParaEliminar.length === 0 ) {
      this.mensaje( 'error', 'Error al Eliminar','¡Seleccione las filas a eliminar por favor!');
      return;
    }

 Swal.fire({
      title: '¿Seguro que quieres continuar?',
      text: `Esta acción va a eliminar ${itemsParaEliminar.length} deudas`,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      onOpen: drawPopup
    }).then((result) => {
      if (result.value) {
        this.spinner.show();

        this.transactionService.deleteAll(itemsParaEliminar)
          .subscribe(() => {
            this.consultaDeuda(() =>
              {
                Swal.fire({
                  title: 'Eliminado!',
                  text: 'Se han eliminado ' + itemsParaEliminar.length + ' registros',
                  showCloseButton: true,
                  showCancelButton: false,
                  onOpen: drawPopup
                })
              });
          }, err => { this.spinner.hide(); });
      }
    });
  }



  Eliminar(item: Debts) {

  Swal.fire({
    title: "¿Esta Seguro de Eliminar el Registro? ",
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonText: 'Si, Borralo',
    cancelButtonText: 'Cerrar',
    onOpen: drawPopup
  }).then((result) => {
    if (result.value) {
      this.spinner.show();
      this.transactionService.deleteDeuda(item.id)
      .subscribe(() => this.consultaDeuda(() =>
      {
        Swal.fire(
          'Eliminado!',
          'Tu registro ha sido eliminado',
          'success'
        )
      }), err => { this.spinner.hide(); });
    }
  });
}

  SeleccionarTodos() {
    this.transactionService.debtItems.data.forEach(itm => itm.selected = this.selectedAll);

  }

/*//////// O P E N  - D I A L O G ///////////////////// */
MostrarListaSelect() {
  this.OcultaListaExcel = true;
}

  openDialog(service: string) {
    this.OcultaListaExcel = false;
    this.cargaExcel = false;
    this.excelService.service = service;
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  DescargarReporte() {
    if( this.transactionService.debtItems.data.length > 0){
      if (this.validaFiltro()) {
        this.transactionService.report(this.filtro)
        .subscribe((r: Blob) => {
          saveAs(r, "reporte.xlsx");
        });
      }
    }else{
      this.mensaje('warning', 'Descarga','No tiene registros para descargar');
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
}



