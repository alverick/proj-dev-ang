import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { all, equals } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';
import { IEntryModel } from 'src/app/shared/models';
import { GtpFilter } from 'src/app/shared/models/gtp-filter';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';

import { QueryDataService } from '../../../../shared/data';
import { StatesGtp } from '../../../../shared/models/states-gtp';
import { CompanyService } from '../../../../shared/services';
import { GtpService } from '../../../../shared/services/gtp.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { adminFullRoutingNames } from '../../admin-routing.names';

@Component({
  selector: 'cs-gtp-grilla',
  templateUrl: './gtp-grilla.page.html',
  styleUrls: ['./gtp-grilla.page.scss'],
})
export class GtpGrillaPage implements OnInit {
  messageTable = '';
  linkHistory = adminFullRoutingNames.HISTORY;
  showArrow = false;
  asc = true;
  orderBys = 0;
  items = [
    {
      label: 'Clientes No Registrados',
      icon: 'pi pi-file-excel',
      command: () => {
        this.clickClientesNoRegistrados();
      },
    },
    {
      label: 'Empresas registradas',
      icon: 'pi pi-file-excel',
      command: () => {
        this.getAccountStateList();
      },
    },
  ];
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
    private companyService: CompanyService,
    private queryDataService: QueryDataService
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
    this.gtpService.services = [];
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

  fixAccounts(): void {
    void swalAlert
      .fire({
        title: 'Actualización masiva de estado saving',
        text: `Actualiza el estado de todos los registros saving a completed, tras error en carga de archivos Excel.`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.queryDataService.regularizeAll().subscribe((result) => {
            console.log(result);
            void swalAlert.fire({
              title: 'Actualización masiva de estado saving',
              text: result.message,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          });
        }
      });
  }
}
