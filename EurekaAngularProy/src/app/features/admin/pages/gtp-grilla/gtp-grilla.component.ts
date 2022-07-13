import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import * as _moment from 'moment'; // dejalo si sale error
import { default as _rollupMoment } from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { RubroModel } from 'src/app/shared/models';
import { GtpFilter } from 'src/app/shared/models/gtp-filter';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { StatesGtp } from '../../../../shared/models/states-gtp';
import { GtpService } from '../../../../shared/services/gtp.service';
import { adminFullRoutingNames } from '../../admin-routing.names';

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
  selector: 'cs-gtp-grilla',
  templateUrl: './gtp-grilla.component.html',
  styleUrls: ['./gtp-grilla.component.scss'],
  styles: [
    `
      :host >>> .tooltip-inner {
        background-color: #fff;
        color: #0d131d !important;
        border-radius: 4px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
        font-size: 11px !important;
        padding: 0.5em 0.3em;
        min-width: 300px !important;
      }
      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #0d131d57;
      }
    `,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GtpGrillaComponent implements OnInit {
  usDatePattern =
    /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  @ViewChild('inputDate1', { static: true }) inputDate1: ElementRef;
  @ViewChild('inputDate2', { static: true }) inputDate2: ElementRef;
  messageTable = '';
  linkHistory = adminFullRoutingNames.HISTORY;
  showArrow = false;
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
    dateTo: null,
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
    dateTo: null,
  };
  errores: any = {};
  orderBy = -1;
  orderDef = [
    { name: 'RequestDate', asc: false },
    { name: 'Ruc', asc: false },
    { name: 'Cu', asc: false },
    { name: 'NameEnterprise', asc: false },
    { name: 'RequestType', asc: false },
    { name: 'Status', asc: false },
    { name: 'BusinessHeading', asc: false },
  ];

  herderTable: any[] = [
    { name: 'Fecha de solicitud', asc: false, orderBy: 0, class: 'c1' },
    { name: 'RUC', asc: false, orderBy: 1, class: 'c2' },
    { name: 'CU', asc: false, orderBy: 2, class: 'c3' },
    { name: 'Nombre de la empresa', asc: false, orderBy: 3, class: 'c4' },
    { name: 'Tipo de solicitud', asc: false, orderBy: 4, class: 'c5' },
    { name: 'Estado', asc: false, orderBy: 5, class: 'c6' },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private afiliacionService: AfiliacionService,
    public gtpService: GtpService,
    private router: Router
  ) {}
  rubros: RubroModel[] = [];
  states: StatesGtp[] = [];
  solicitudes: StatesGtp[] = [];

  ngOnInit() {
    this.afiliacionService.GetRubros().subscribe((d) => (this.rubros = d));
    this.gtpService.getStates().subscribe((d) => {
      this.states = d;
    });
    this.gtpService.getTipoSolicitudes().subscribe((d) => {
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
    this.router.navigate([adminFullRoutingNames.APPROVE + ClientId]);
    // location.href = '/AprobacionGtp/'+ClientId;
  }
  onUpdateEAG(ClientId: number) {
    this.gtpService.ReenviarPAG(ClientId).subscribe((r) => {
      this.consultaGtp();
    });
  }
  changePage(nro: number) {
    this.currentFiltro.pageNumber = nro;
    this.consultaGtp();
  }
  //// ORDENAMIENTO OCULTAR LAS FLECHAS
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
  //
  //   this.consultaGtp();
  // }
  orderByColum() {}

  private validaFiltro() {
    let res = true;
    for (const s in this.errores) {
      if (this.errores[s]) {
        res = false;
      }
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

    if (
      (this.filtro.inputSearch === '' ||
        this.filtro.inputSearch === null ||
        this.filtro.inputSearch === undefined) &&
      (this.filtro.BusinessHeading === '' ||
        this.filtro.BusinessHeading === null ||
        this.filtro.BusinessHeading === undefined) &&
      (this.filtro.status == '' ||
        this.filtro.status === null ||
        this.filtro.status === undefined) &&
      (this.filtro.statussolcitud == '' ||
        this.filtro.statussolcitud === null ||
        this.filtro.statussolcitud === undefined) &&
      /*this.filtro.dateFrom == ''  ||*/ (this.filtro.dateFrom === null ||
        this.filtro.dateFrom === undefined)
    ) {
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
    if (this.validaFiltro()) {
      this.spinner.show();
      this.gtpService.getEmpresas(this.currentFiltro).subscribe(
        (d) => {
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
    }
  }

  ceroRegistros(): boolean {
    if (
      sessionStorage.getItem('tk') === null ||
      sessionStorage.getItem('tk') === ''
    ) {
      return false;
    } else {
      if (this.gtpService.EnterprisesItems.totalCompanies === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  ///////////// FECHAS /////////////////////////////////////////////////////

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

  change(e) {}

  clickClientesNoRegistrados() {
    this.gtpService.clientsUnregistered(this.filtro).subscribe((r: Blob) => {
      saveAs(r, 'ClientesNoRegistrados.xlsx');
    });
  }

  private internalValidaDateFrom(e) {
    if (e === null) {
      this.errores['dateFrom'] = 'No es una fecha válida';
    } else {
      const yearFrom = new Date(e).getFullYear();
      if (yearFrom < 2000 || yearFrom > 2050) {
        this.errores['dateFrom'] = 'Fecha Inválida';
      } else {
        delete this.errores.dateFrom;
      }
    }
  }

  private internalValidaDateTo(e) {
    if (e === null) {
      this.errores['dateTo'] = 'No es una fecha válida';
    } else {
      const yearTo = new Date(e).getFullYear();
      if (yearTo < 2000 || yearTo > 2050) {
        this.errores['dateTo'] = 'Fecha Inválida';
      } else if (this.filtro.dateFrom && e < this.filtro.dateFrom) {
        this.errores['dateTo'] = 'No puede ser menor a la emisión';
      } else {
        delete this.errores.dateTo;
      }
    }
  }

  goCargaHistorico(id: number) {
    this.router.navigate([adminFullRoutingNames.HISTORY, id]);
  }
}
