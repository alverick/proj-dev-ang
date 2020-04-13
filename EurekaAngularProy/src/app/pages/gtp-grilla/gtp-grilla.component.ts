import { GtpService } from './../../shared/services/gtp.service';
import { StatesGtp } from './../../shared/models/states-gtp';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { RubroModel } from 'src/app/shared/models';
import { GtpFilter } from 'src/app/shared/models/gtp-filter';

/// DATE PIECKER FORMAT
import * as _moment from 'moment';  // dejalo si sale error
import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { EnterprisesGtp, EnterprisesPagedList } from 'src/app/shared/models/enterprises-gtp';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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


@Component({
  selector: 'app-gtp-grilla',
  templateUrl: './gtp-grilla.component.html',
  styleUrls: ['./gtp-grilla.component.scss'],
  providers: [

    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GtpGrillaComponent implements OnInit {
  usDatePattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  @ViewChild('inputDate1', { static: true }) inputDate1: ElementRef;
  @ViewChild('inputDate2', { static: true }) inputDate2: ElementRef;
  messageTable: string = '';
  showArrow: boolean = false;
  asc = true;
  orderBys = 0;
  currentFiltro: GtpFilter = {
    pageNumber: 1,
    ColumnName: 'requestDate',
    asc: false,
    inputSearch: '',
    BusinessHeading: '',
    status: '',
    statussolcitud: '',
    dateFrom: null,
    dateTo: null
  };
  filtro: GtpFilter = {
    pageNumber: 1,
    ColumnName: '',
    asc: true,
    inputSearch: '',
    BusinessHeading: '',
    status: '',
    statussolcitud: '',
    dateFrom: null,
    dateTo: null
  };
  errores: any = {};
  orderBy = -1;
  orderDef = [
    { name: 'requestDate', asc: false },
    { name: 'ruc', asc: false },
    { name: 'cu', asc: false },
    { name: 'nameEnterprise', asc: false },
    { name: 'status', asc: false },
    { name: 'requestTypeList', asc: false },
    { name: 'businessHeading', asc: false },
  ]

  herderTable: any[] = [
    { name: 'Fecha de solicitud', asc: false, orderBy: 0, class: 'c1' },
    { name: 'RUC', asc: false, orderBy: 1, class: 'c2' },
    { name: 'CU', asc: false, orderBy: 2, class: 'c3' },
    { name: 'Nombre de la empresa', asc: false, orderBy: 3, class: 'c4' },
    { name: 'Tipo de solicitud', asc: false, orderBy: 4, class: 'c5' },
    { name: 'Estado', asc: false, orderBy: 5, class: 'c6' },


  ]

  constructor(private spinner: NgxSpinnerService, private afiliacionService: AfiliacionService, public gtpService: GtpService, private router: Router) { }
  rubros: RubroModel[] = [];
  states: StatesGtp[] = [];
  solicitudes: StatesGtp[] = [];


  ngOnInit() {

    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
    this.gtpService.getStates().subscribe(d => {
      console.log('stado', d)
      this.states = d;

    });
    this.gtpService.getTipoSolicitudes().subscribe(d => {
      this.solicitudes = d;
    });
    this.consultaGtp();
  }
  limpiardate1() {
    this.inputDate1.nativeElement.value = '';
    this.filtro.dateFrom = null;
  }
  limpiardate2() {
    this.inputDate2.nativeElement.value = '';
    this.filtro.dateTo = null;
  }
  Aprobar(ClientId: number) {
    console.log('ingresa a probacion');
    this.router.navigate(['/AprobacionGtp/' + ClientId]);
    // location.href = '/AprobacionGtp/'+ClientId;
  }
  onUpdateEAG(ClientId: number) {
    console.log('ClientId', ClientId);
    this.gtpService.ReenviarPAG(ClientId)
      .subscribe(r => {
        this.consultaGtp();
      });
  }
  changePage(nro: number) {
    this.currentFiltro.pageNumber = nro;
    this.consultaGtp();
  }
  ////ORDENAMIENTO OCULTAR LAS FLECHAS
  orderList(items: any) {
    items.asc = !items.asc;
    this.orderBy = items.orderBy;
    this.orderDef[items.orderBy].asc = items.asc;
    this.currentFiltro.asc = items.asc;
    this.currentFiltro.ColumnName = this.orderDef[items.orderBy].name;
    this.consultaGtp();
  }
  // orderList(index: number, asc: boolean) {
  //   this.orderBy = index;
  //   this.orderDef[index].asc = asc;

  //   this.currentFiltro.asc = asc;
  //   this.currentFiltro.ColumnName = this.orderDef[index].name;
  //   console.log('filter ', this.currentFiltro)
  //   this.consultaGtp();
  // }
  orderByColum() {

  }


  private validaFiltro() {
    let res: boolean = true;
    for (var s in this.errores) {
      if (this.errores[s])
        res = false;
    }
    return res;
  }

  sendFiltro() {
    this.currentFiltro.inputSearch = this.filtro.inputSearch;
    this.currentFiltro.BusinessHeading = this.filtro.BusinessHeading;
    this.currentFiltro.status = this.filtro.status;
    this.currentFiltro.statussolcitud = this.filtro.statussolcitud;
    this.currentFiltro.dateFrom = this.filtro.dateFrom;
    this.currentFiltro.dateTo = this.filtro.dateTo;

    this.consultaGtp();

    if ((this.filtro.inputSearch === '' || this.filtro.inputSearch === null || this.filtro.inputSearch === undefined) &&
      (this.filtro.BusinessHeading === '' || this.filtro.BusinessHeading === null || this.filtro.BusinessHeading === undefined) &&
      (this.filtro.status == '' || this.filtro.status === null || this.filtro.status === undefined) &&  (this.filtro.statussolcitud == '' || this.filtro.statussolcitud === null || this.filtro.statussolcitud === undefined) &&
      ( /*this.filtro.dateFrom == ''  ||*/ this.filtro.dateFrom === null || this.filtro.dateFrom === undefined)) {
      this.messageTable = 'No se encontraron empresas para esta búsqueda';
      this.showArrow = true;
    } else {
      this.messageTable = 'No se encontraron empresas para esta búsqueda';
      this.showArrow = false;
    }
  }

  // callback:  cuando se termine de ejecutar la consulta se ejecuta el callback
  // consultaDeuda(cb: () => void = null) {

  consultaGtp() {
    console.log( "consultaGTP buscar",this.currentFiltro);
    if (this.validaFiltro()) {
      this.spinner.show();
      this.gtpService.getEmpresas(this.currentFiltro).subscribe(d => {
        console.log('empresa', this.gtpService.EnterprisesItems)
        this.spinner.hide();
      }, err => { this.spinner.hide(); });
    }


  }

  ceroRegistros(): boolean {
    if (sessionStorage.getItem('tk') === null || sessionStorage.getItem('tk') === '') {
      //this.router.navigate(['/login']);
      return false;
    } else {
      if (this.gtpService.EnterprisesItems.totalCompanies === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  /////////////FECHAS /////////////////////////////////////////////////////

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

  change(e) {

  }

  private internalValidaDateFrom(e) {
    console.log(e);
    if (e === null) {
      this.errores['dateFrom'] = 'No es una fecha válida';
    }
    else {
      let yearFrom = new Date(e).getFullYear();
      if (yearFrom < 2000 || yearFrom > 2050) {
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
      if (yearTo < 2000 || yearTo > 2050) {
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

}

