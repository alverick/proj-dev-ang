import { Component, OnInit } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import * as _moment from 'moment'; // dejalo si sale error
import { default as _rollupMoment } from 'moment';
import { all, equals } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';
import { IEntryModel } from 'src/app/shared/models';
import { GtpFilter } from 'src/app/shared/models/gtp-filter';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { StatesGtp } from '../../../../shared/models/states-gtp';
import { CompanyService } from '../../../../shared/services';
import { GtpService } from '../../../../shared/services/gtp.service';
import { adminFullRoutingNames } from '../../admin-routing.names';

//// END DATE ////////////////////

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
  templateUrl: './gtp-grilla.page.html',
  styleUrls: ['./gtp-grilla.page.scss'],
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
export class GtpGrillaPage implements OnInit {
  messageTable = '';
  linkHistory = adminFullRoutingNames.HISTORY;
  showArrow = false;
  asc = true;
  orderBys = 0;
  initialFilter: GtpFilter = {
    pageNumber: 1,
    ColumnName: 'requestDate',
    asc: false,
    inputSearch: '',
    BusinessHeading: '',
    status: '',
    statusSolicitud: '',
    dateFrom: null,
    dateTo: null,
  };
  currentFilter: GtpFilter = {
    pageNumber: 1,
    ColumnName: 'requestDate',
    asc: false,
    inputSearch: '',
    BusinessHeading: '',
    status: '',
    statusSolicitud: '',
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
    statusSolicitud: '',
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
    private afiliacionService: AfiliacionService,
    public gtpService: GtpService,
    private router: Router,
    private companyService: CompanyService
  ) {}

  rubros: IEntryModel[] = [];
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

  Aprobar(ClientId: number) {
    this.router.navigate([adminFullRoutingNames.APPROVE + ClientId]);
  }

  onUpdateEAG(ClientId: number) {
    this.gtpService.ReenviarPAG(ClientId).subscribe(() => {
      this.consultaGtp();
    });
  }

  changePage(nro: number) {
    this.currentFilter.pageNumber = nro;
    this.consultaGtp();
  }

  //// ORDENAMIENTO OCULTAR LAS FLECHAS
  orderList(items: any) {
    items.asc = !items.asc;
    this.orderBy = items.orderBy;
    this.orderDef[items.orderBy].asc = items.asc;
    this.currentFilter.asc = items.asc;
    this.currentFilter.ColumnName = this.orderDef[items.orderBy].name;
    this.consultaGtp();
  }

  resetDebts() {
    if (!equals(this.initialFilter, this.currentFilter)) {
      this.currentFilter = this.initialFilter;
      const { statusSolicitud, status, inputSearch, BusinessHeading } =
        this.initialFilter;
      this.submitSearch(inputSearch, BusinessHeading, status, statusSolicitud);
    }
  }

  searchDebts(filterData: any) {
    const filter: GtpFilter = {
      ...this.initialFilter,
      ...filterData,
    };
    if (!equals(filter, this.currentFilter)) {
      this.currentFilter = {
        ...this.currentFilter,
        ...filter,
      };
      this.submitSearch(
        filterData.inputSearch,
        filterData.BusinessHeading,
        filterData.status,
        filterData.statusSolicitud
      );
    }
  }

  private submitSearch(inputSearch, BusinessHeading, status, statusSolicitud) {
    this.consultaGtp();
    this.messageTable = 'No se encontraron empresas para esta búsqueda';
    this.showArrow = all(isNilOrEmpty, [
      inputSearch,
      BusinessHeading,
      status,
      statusSolicitud,
    ]);
  }

  async consultaGtp() {
    await this.gtpService.getEmpresas(this.currentFilter).toPromise();
  }

  ceroRegistros(): boolean {
    return sessionStorage.getItem('tk') === null ||
      sessionStorage.getItem('tk') === ''
      ? false
      : this.gtpService.EnterprisesItems.totalCompanies === 0;
  }

  clickClientesNoRegistrados() {
    this.gtpService.clientsUnregistered(this.filtro).subscribe((r: Blob) => {
      saveAs(r, 'ClientesNoRegistrados.xlsx');
    });
  }

  getAccountStateList(): void {
    this.companyService.getAccountStateDetailsList().subscribe((r: Blob) => {
      saveAs(r, 'Detalles de cuentas.xlsx');
    });
  }
}
