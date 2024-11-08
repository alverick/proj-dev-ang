import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, type OnDestroy, type OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { all, equals } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';
import { lastValueFrom, type Subscription, timer } from 'rxjs';

import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { PaymentsFilterComponent } from '../../../../shared/components/payments-filter/payments-filter.component';
import { QueryDataService } from '../../../../shared/data';
import { type IEntryModel } from '../../../../shared/models';
import { type GtpFilter } from '../../../../shared/models/gtp-filter';
import { type StatesGtp } from '../../../../shared/models/states-gtp';
import { CompanyService } from '../../../../shared/services';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { GtpService } from '../../../../shared/services/gtp.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { adminFullRoutingNames } from '../../admin-routing.names';

@Component({
  selector: 'cs-gtp-grilla',
  templateUrl: './gtp-grilla.page.html',
  styleUrls: ['./gtp-grilla.page.scss'],
  standalone: true,
  imports: [
    PaymentsFilterComponent,
    SplitButtonModule,
    ButtonDirective,
    Ripple,
    TooltipModule,
    RouterLink,
    NgxPaginationModule,
    FooterComponent,
    DecimalPipe,
    DatePipe,
  ],
})
export class GtpGrillaPage implements OnInit, OnDestroy {
  messageTable = '';
  linkHistory = adminFullRoutingNames.HISTORY;
  showArrow = false;
  disabledButtonFixSaving = true;
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
    status: [],
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
    status: [],
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
    status: [],
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

  rubros: IEntryModel[] = [];
  states: StatesGtp[] = [];
  solicitudes: StatesGtp[] = [];
  checkTimeObservable: Subscription;

  constructor(
    private afiliacionService: AfiliacionService,
    public gtpService: GtpService,
    private router: Router,
    private companyService: CompanyService,
    private queryDataService: QueryDataService,
  ) {}

  ngOnInit() {
    this.afiliacionService.GetRubros().subscribe((d) => (this.rubros = d));
    this.gtpService.getStates().subscribe((d) => {
      this.states = d;
    });
    this.gtpService.getTipoSolicitudes().subscribe((d) => {
      this.solicitudes = d;
    });
    void this.consultaGtp();
    const intervalMs = 10000;

    this.checkTimeObservable = timer(0, intervalMs).subscribe(() => {
      const timeVal = new Date().getHours();
      this.disabledButtonFixSaving = timeVal < 20 || timeVal >= 22;
    });
  }

  ngOnDestroy(): void {
    this.checkTimeObservable.unsubscribe();
  }

  Aprobar(ClientId: number) {
    this.gtpService.services = [];
    void this.router.navigate([`${adminFullRoutingNames.APPROVE}${ClientId}`]);
  }

  onUpdateEAG(ClientId: number) {
    this.gtpService.ReenviarPAG(ClientId).subscribe(() => {
      void this.consultaGtp();
    });
  }

  changePage(nro: number) {
    this.currentFilter.pageNumber = nro;
    void this.consultaGtp();
  }

  //// ORDENAMIENTO OCULTAR LAS FLECHAS
  orderList(items: any) {
    items.asc = !items.asc;
    this.orderBy = items.orderBy;
    this.orderDef[items.orderBy].asc = items.asc;
    this.currentFilter.asc = items.asc;
    this.currentFilter.ColumnName = this.orderDef[items.orderBy].name;
    void this.consultaGtp();
  }

  resetDebts() {
    if (!equals(this.initialFilter, this.currentFilter)) {
      this.currentFilter = this.initialFilter;
      const { statusSolicitud, status, inputSearch, BusinessHeading } =
        this.initialFilter;
      this.submitSearch(inputSearch, BusinessHeading, status, statusSolicitud);
    }
  }

  searchDebts(filterData) {
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
        filterData.statusSolicitud,
      );
    }
  }

  private submitSearch(inputSearch, BusinessHeading, status, statusSolicitud) {
    void this.consultaGtp();
    this.messageTable = 'No se encontraron empresas para esta búsqueda';
    this.showArrow = all(isNilOrEmpty, [
      inputSearch,
      BusinessHeading,
      status,
      statusSolicitud,
    ]);
  }

  async consultaGtp() {
    await lastValueFrom(this.gtpService.getEmpresas(this.currentFilter));
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
        title: 'Sincronización masiva de cargas de cobros',
        text: `Todas las cargas de excel de todas las empresas registradas pasarán del estado SAVING o VALIDATING a FAILED, luego el cliente podrá realizar una nueva carga`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sí, sincronizar',
        cancelButtonText: 'Cancelar',
      })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.queryDataService.regularizeAll().subscribe((result) => {
            void swalAlert.fire({
              title: result.success
                ? 'Sincronización exitosa'
                : 'Ha ocurrido un error',
              html:
                result.rows === 0
                  ? result.message
                  : `Se actualizó <strong>${result.rows} registro(s)</strong> de carga de cobros, del estado SAVING o VALIDATING a FAILED.`,
              showConfirmButton: true,
              confirmButtonText: 'Entendido',
            });
          });
        }
      });
  }
}
