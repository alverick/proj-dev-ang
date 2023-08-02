import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { ShepherdService } from 'angular-shepherd';
import * as saveAs from 'file-saver';
import { LazyLoadEvent } from 'primeng/api';
import { all, equals, isNil, pathEq, pathOr, prop } from 'ramda';
import { isNilOrEmpty, isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { CompanyServices } from '../../../../shared/models/company';
import { DateList } from '../../../../shared/models/dateList';
import { Debts } from '../../../../shared/models/debts';
import { DebstFilter } from '../../../../shared/models/debts-filter.model';
import { User } from '../../../../shared/models/user.model';
import { WayPay } from '../../../../shared/models/way-pay';
import { ExcelService } from '../../../../shared/services/excel.service';
import { GoogleAnalytics } from '../../../../shared/services/googleAnalytics.service';
import { HomeService } from '../../../../shared/services/home.service';
import { LoadBarService } from '../../../../shared/services/load-bar.service';
import {
  LoadFileService,
  ModalCloseData,
} from '../../../../shared/services/load-file.service';
import { LoginService } from '../../../../shared/services/login.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { TransactionService } from '../../../../shared/services/transaction.service';
import { drawPopup, swalAlert } from '../../../../shared/utils/helpers/popups';
import { MovementsService } from '../../services';
import { AgregaCobroComponent } from './components/agrega-cobro.component';
import { DebtComponent } from './components/debt.component';
import { DialogComponent } from './components/dialog';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { Popover } from './components/popover/popover.service';
import { TableMovementsComponent } from './components/table-movements/table-movements.component';
import * as DOMPurify from 'dompurify';

@Component({
  selector: 'cs-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    public transactionService: TransactionService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    private loginService: LoginService,
    private popover: Popover,
    private gaService: GoogleAnalytics,
    private fileLoad: LoadFileService,
    private barLoad: LoadBarService,
    private movementsService: MovementsService,
    private router: Router,
    private shepherdService: ShepherdService
  ) {
    transactionService.itemsForDelete = [];
    const navigation = this.router.getCurrentNavigation();
    let form = pathOr(null, ['extras', 'state', 'filter'], navigation);
    if (isNotNil(form)) {
      form = { ...form, payment: form.payment.code };
    }
    this.formValues = form;
  }

  numeroPagina: number;
  orderBy = -1;
  @ViewChild('cargaExcel', { static: true }) cargaExcel;
  state = false;
  public user: User;
  OcultaListaExcel = true;
  typeList: Partial<CompanyServices>[];
  waypayList: WayPay[];
  DateList: DateList[];
  type: string[];
  date: string[];
  serviceSelected: string;
  services: any[];
  selectedAll = true;
  selectedUniverse = false;
  showEdit = false;

  currentFilter: DebstFilter = {
    pageNumber: 1,
    columnName: '',
    asc: true,
    inputSearch: '',
    service: '',
    status: '',
    dateForFilter: '',
    dateFrom: null,
    dateTo: null,
  };
  initialFilter: DebstFilter = {
    pageNumber: 1,
    columnName: '',
    asc: true,
    inputSearch: '',
    service: '',
    status: '',
    dateForFilter: '',
    dateFrom: null,
    dateTo: null,
  };
  errores: any = {};
  querySearch = false;
  control: any;
  messageTable = '';
  showArrow = false;

  @ViewChild('fileLoad', { read: ViewContainerRef, static: true })
  fileLoadContainer: ViewContainerRef;
  formValues;
  public enDescarga = false;

  selectedRows: Debts[] = [];
  tableSortField = '';
  styleTag: HTMLStyleElement;
  tableMovementsInactive = false;
  @ViewChild('tableMovements') tableMovements: TableMovementsComponent;
  resetFilterEvt: Subject<boolean> = new Subject();

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updatePositionModal();
  }

  ngOnInit() {
    this.fileLoad.onClose.subscribe(this.onClose());
    this.fileLoad.verify(this.fileLoadContainer);
    this.user = this.storageService.getCurrentUser();
    this.loginService.refresh();
    this.homeService.getServices(true).subscribe((value) => {
      this.services = value;
      this.serviceSelected = value[0];
    });
    this.homeService.getServicesActive(false).subscribe((value) => {
      this.typeList = value;
    });
    this.homeService.getWayPay().subscribe((value) => {
      this.waypayList = value;
    });
    this.homeService.getDate().subscribe((value) => {
      this.DateList = value;
    });

    this.transactionService.debtItems = {
      data: [],
      countNoIbkPayments: 0,
      count: 0,
    };
    if (isNil(this.formValues)) {
      this.consultaDeuda();
    }
    this.recortarNombres();
    this.cargaExcel = false;

    this.selectedAll = false;
    this.selectedUniverse = false;
    if (document.querySelector('style.onboarding-style')) {
      this.styleTag = document.querySelector('style.onboarding-style');
    } else {
      this.styleTag = document.createElement('style');
      this.styleTag.className = 'onboarding-style';
      document.getElementsByTagName('head')[0].appendChild(this.styleTag);
    }
  }

  private onClose() {
    return (m: ModalCloseData) => {
      if (m.status === 'completed') {
        this.fileLoad.close();
        let msg = '';
        if (m.dataType === 'C') {
          msg = `¡Listo! Se agregaron nuevas deudas `;
        } else {
          msg = `¡Listo! Se agregaron nuevos clientes`;
        }
        void swalAlert.fire({
          title: msg,
          text: 'Recuerda que puedes eliminar y/o editar los datos de tus clientes desde la página de movimientos',
          showCloseButton: true,
          confirmButtonText: 'CERRAR',
          didClose: () => {
            this.validateResetForm();
          },
        });
      } else if (m.status === 'failed') {
        this.fileLoad.close();
        void swalAlert.fire({
          title: 'Lo sentimos, no se pudo finalizar la carga de cobros',
          text: 'Por favor, revisa si algunos cobros se cargaron correctamente y luego inténtalo nuevamente.',
          showCloseButton: true,
          confirmButtonText: 'Ver cobros cargados',
          didClose: () => {
            this.validateResetForm();
          },
        });
      } else if (m.status === 'rejected') {
        this.fileLoad.close();
        this.excelService.statusUpload = false;
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '899px',
          backdropClass: 'backdrop-background-opaque',
        });
        dialogRef.componentInstance.ready = true;
        dialogRef.componentInstance.rowsAccepted = m.rowsAccepted;
        dialogRef.componentInstance.rowsRejected = m.rowsRejected;
      }
    };
  }

  ngAfterViewInit(): void {
    this.setOnboarding();
    this.updatePositionModal();
  }

  private setOnboarding() {
    const buttonSkip = {
      text: 'Omitir',
      classes: 'btn-outline-primary',
      type: 'cancel',
    };
    const buttonBack = {
      text: 'Atrás',
      classes: 'btn-outline-primary',
      type: 'back',
    };
    const buttonNext = {
      text: 'Siguiente',
      classes: 'btn-primary',
      type: 'next',
    };
    this.shepherdService.defaultStepOptions = {
      classes: 'onboarding-step',
      scrollTo: true,
      modalOverlayOpeningRadius: 4,
      arrow: false,
      canClickTarget: false,
      cancelIcon: {
        enabled: true,
      },
    };
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    this.shepherdService.addSteps([
      {
        id: 'intro',
        buttons: [buttonSkip, { ...buttonNext, text: 'Empezar' }],
        cancelIcon: {
          enabled: false,
        },
        classes: 'custom-class-name-1 custom-class-name-2',
        highlightClass: 'highlight',
        text: [
          '<img src="assets/images/ilustracion-boy-elm.png" alt="Resumen" height="242" width="326" class="tw-mx-auto" /><h4 class="tw-font-medium tw-py-2">¡Bienvenido a Cobro Simple!</h4><p class="tw-text-sm">Hemos preparado un pequeño tutorial para orientarte.</p>',
        ],
      },
      {
        id: 'addDeuda',
        attachTo: {
          element: '.addDeuda',
          on: 'bottom',
        },
        buttons: [{ ...buttonSkip, text: 'Cerrar' }, buttonNext],
        classes: 'tw-translate-y-2',
        highlightClass: 'highlight',
        title: () => this.getStepPositionTitle(),
        text: '<h4 class="tw-font-medium tw-pb-2">Agrega cobros</h4><p class="tw-text-sm">Si tienes un servicio con data completa o parcial, el primer paso es agregar cobros. Puedes hacerlo de manera individual o masiva con nuestra plantilla de Excel.</p>',
        when: {
          show: () => {
            setTimeout(() => {
              this.updatePositionModal();
            }, 200);
          },
        },
      },
      {
        id: 'lista',
        attachTo: {
          element: '.movements',
          on: 'bottom-end',
        },
        buttons: [buttonBack, buttonNext],
        classes: 'records tw-translate-y-4',
        highlightClass: 'highlight',
        modalOverlayOpeningPadding: 9,
        title: () => this.getStepPositionTitle(),
        text: '<h4 class="tw-font-medium tw-pb-2">Ver y editar registros</h4><p class="tw-text-sm">Podrás ver el estado de tus cobros y agregar/editar pagos haciendo clic en “Ver detalle”. Solo se pueden editar los pagos que son agregados manualmente.</p><img src="assets/images/movements-example.png" alt="Ejemplo"  class="tw-mx-auto tw-w-full" />',
        when: {
          show: () => {
            this.tableMovementsInactive = true;
          },
          hide: () => {
            this.tableMovementsInactive = false;
          },
        },
      },
      {
        id: 'filter',
        attachTo: {
          element: '.widget.filtros .content',
          on: 'bottom-end',
        },
        buttons: [buttonBack, buttonNext],
        classes: 'tw-translate-y-2',
        highlightClass: 'highlight',
        title: () => this.getStepPositionTitle(),
        text: '<h4 class="tw-font-medium tw-pb-2">Encuentra rápido a tus clientes</h4><p class="tw-text-sm">Puedes buscarlos por código o filtrar el servicio, estado del cobro y un rango de fechas.</p>',
      },
      {
        id: 'menu-services',
        attachTo: {
          element:
            'cs-internal-header ul.navigation-menu > li:nth-child(2) > a',
          on: 'bottom',
        },
        buttons: [buttonBack, buttonNext],
        classes: 'tw-translate-y-2',
        highlightClass: 'highlight',
        title: () => this.getStepPositionTitle(),
        text: '<h4 class="tw-font-medium tw-pb-2">Edita y crea nuevos servicios</h4><p class="tw-text-sm">Podrás ver la lista completa de servicios y editarlos o eliminarlos.</p>',
      },
      {
        id: 'menu-company',
        attachTo: {
          element:
            'cs-internal-header ul.navigation-menu > li:nth-child(3) > a',
          on: 'bottom',
        },
        buttons: [buttonBack, buttonNext],
        classes: 'tw-translate-y-2',
        highlightClass: 'highlight',
        title: () => this.getStepPositionTitle(),
        text: '<h4 class="tw-font-medium tw-pb-2">Edita los datos de tu empresa</h4><p class="tw-text-sm">Cambia el nombre con el que tus clientes te encontrarán en nuestros canales digitales. Aquí también puedes cambiar tu contraseña.</p>',
      },
      {
        id: 'menu-notifications',
        attachTo: {
          element: '#lnkMessages',
          on: 'bottom',
        },
        buttons: [buttonBack, { ...buttonNext, text: 'Finalizar' }],
        classes: 'tw-translate-y-2',
        highlightClass: 'highlight',
        scrollTo: false,
        title: () => this.getStepPositionTitle(),
        text: '<h4 class="tw-font-medium tw-pb-2">Siempre actualizado</h4><p class="tw-text-sm">Cada vez que un cliente realice un pago, recibirás una notificación.</p>',
      },
    ]);
  }

  ngOnDestroy(): void {
    this.shepherdService.complete();
  }

  getStepPositionTitle() {
    const tourObject = this.shepherdService.tourObject;
    const intro = tourObject.getById('intro');
    const current = tourObject.getCurrentStep();
    const position = tourObject.steps.indexOf(current) + (isNil(intro) ? 1 : 0);
    const steps = isNil(intro)
      ? tourObject.steps.length
      : tourObject.steps.length - 1;
    return `<i class="pi pi-question-circle tw-pr-2 tw-text-xs"></i>${position} de ${steps}`;
  }

  showOnboarding() {
    this.shepherdService.tourObject.removeStep('intro');
    this.shepherdService.start();
  }

  updatePositionModal() {
    const element: HTMLElement = document.querySelector('.movements');
    const top =
      element.getBoundingClientRect().top +
      element.getBoundingClientRect().height +
      window.scrollY;
    const left = element.getBoundingClientRect().left - 10;
    const width = element.getBoundingClientRect().width + 20;
    this.styleTag.innerHTML = `.shepherd-element.records.onboarding-step {
    top: ${top}px!important;
    left: ${left}px!important;
    width: ${width}px!important;
     }`;
  }

  resetControlsGrid() {
    this.selectedAll = false;
    this.selectedUniverse = false;
    this.transactionService.clearMarksForDeletes();
  }

  resetDebts() {
    this.tableSortField = '';
    if (!equals(this.initialFilter, this.currentFilter)) {
      this.currentFilter = this.initialFilter;
      const { dateForFilter, status, inputSearch, service } =
        this.initialFilter;
      this.submitSearch(inputSearch, service, status, dateForFilter);
    }
  }

  validateResetForm() {
    if (equals(this.initialFilter, this.currentFilter)) {
      this.resetControlsGrid();
      this.consultaDeuda();
    } else {
      this.resetFilterEvt.next(true);
    }
  }

  searchDebts(filterData) {
    const {
      status,
      dateForFilter,
      inputSearch,
      dateTo = null,
      dateFrom = null,
      service,
    } = filterData;
    const filter: DebstFilter = {
      ...this.initialFilter,
      status,
      dateForFilter,
      inputSearch,
      dateTo,
      dateFrom,
      service,
      pageNumber: 1,
    };
    if (!equals(filter, this.currentFilter)) {
      this.currentFilter = {
        ...this.currentFilter,
        ...filter,
      };
      this.tableSortField = '';
      this.submitSearch(inputSearch, service, status, dateForFilter);
    }
  }

  private submitSearch(inputSearch, service, status, dateForFilter) {
    this.querySearch = true;
    this.resetControlsGrid();
    this.consultaDeuda();

    this.gaService.sendEvent('Buscar', {
      event_category: 'Dashboard',
      event_label: 'buscar',
    });
    if (all(isNilOrEmpty, [inputSearch, service, status, dateForFilter])) {
      this.messageTable = 'Para empezar, agrega la lista de los cobros';
      this.showArrow = true;
    } else {
      this.messageTable = 'No se encontró ningún registro para esta búsqueda';
      this.showArrow = false;
    }
  }

  mensaje(tipo: any, titulo: string, text: string) {
    if (sessionStorage.getItem('tk') !== null) {
      this.mesageeError(tipo, titulo, text);
    }
  }

  mesageeError(_tipo: any, titulo: string, text: string) {
    void Swal.fire({
      title: titulo,
      html: text,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'CANCELAR',
      onOpen: drawPopup,
    });
  }

  consultaDeuda(cb: () => void = null) {
    // eslint-disable-next-line prefer-const

    this.transactionService
      .getDeuda(this.currentFilter, this.selectedUniverse)
      .subscribe(() => {
        if (this.transactionService.debtItems.data.length > 0) {
          this.selectedAll = this.transactionService.isMarkedAll(
            this.selectedUniverse
          );
        }
        this.validateOnboarding(
          this.transactionService.debtItems.data.length > 0
        );
        if (cb) {
          cb();
        }
      });
    this.messageTable = 'Para empezar, agrega la lista de las deudas';
    this.showArrow = true;
  }

  validateOnboarding(hasRecords: boolean) {
    const username = DOMPurify.sanitize(window.sessionStorage.getItem('username'));
    let settings = DOMPurify(JSON.parse(window.localStorage.getItem('settings')));
    const saved = pathEq([username, 'ob', 'mov'], 1, settings);
    if (!saved) {
      if (isNil(settings)) {
        settings = {};
      }
      settings[username] = { ob: { mov: 1 } };
      localStorage.setItem('settings', JSON.stringify(settings));
    }
    if (!hasRecords && !saved) {
      this.shepherdService.start();
    }
  }

  recortarNombres() {
    this.transactionService.debtItems.data.forEach((element) => {
      element.firstName;
    });
  }

  saveDebt(item: Debts) {
    void Swal.fire({
      title: '¿Deseas actualizar?',
      text: '¡No podrás revertir esto!',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'SI, ACTUALIZAR',
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup,
    }).then((result) => {
      if (result.value) {
        //  item.edit = false;
        const debts = {
          emissionDate: item.emissionDate,
          dueDate: item.dueDate,
          concept: item.concept,
          amount: item.amount,
          firstName: item.firstName,
        };

        if (item.newStatus === '1') {
          this.transactionService
            .editDeuda(item.id, debts)
            .subscribe((debtsUpdate) => {
              if (debtsUpdate.success) {
                this.gaService.sendEvent('EditarDeuda', {
                  event_category: 'Dashboard',
                  event_label: 'editar_deuda',
                });
                void Swal.fire({
                  titleText: 'Editado',
                  text: 'Su registro ha sido editado',
                  showCloseButton: true,
                  showCancelButton: false,
                  onOpen: drawPopup,
                  onAfterClose: () => {
                    this.consultaDeuda();
                  },
                });
              } else {
                void Swal.fire({
                  titleText: 'ERROR',
                  text: debtsUpdate.message,
                  showCloseButton: true,
                  showCancelButton: false,
                  onOpen: drawPopup,
                });
                this.transactionService.resetDebts();
              }
            });
        } else if (item.newStatus === '2') {
          this.transactionService
            .updateDeuda(item.id, true)
            .subscribe((statusUpdate) => {
              void Swal.fire({
                titleText: 'Editado',
                text: 'Su registro a sido editado',
                showCloseButton: true,
                showCancelButton: false,
                onOpen: drawPopup,
                onAfterClose: () => {
                  item.status = 'PAGADO';
                  item.amountPayed = statusUpdate.payed;
                  item.payDate = new Date();
                  item.channel = 'Efectivo';
                  this.showEdit = true;
                  // item.edit = false;
                  item.newStatus = null;
                  item.editInput = false;
                  item.editButton = false;
                  item.editPending = false;
                },
              });
            });
        }
      } else {
        this.transactionService.resetDebts();
      }
    });
  }

  changePage(nro: number) {
    this.currentFilter.pageNumber = nro;
    this.numeroPagina = nro;
    this.consultaDeuda();
    this.selectedAll = this.transactionService.isMarkedAll(
      this.selectedUniverse
    );
  }

  EliminarSeleccionados() {
    const totalForDelete = this.selectedRows.length;
    if (totalForDelete === 0) {
      return;
    }
    let message = '';
    let finalMessage = '';
    if (totalForDelete === 1) {
      message = `Esta acción va a eliminar ${totalForDelete} deuda`;
    }
    if (totalForDelete > 1) {
      message = `Esta acción va a eliminar ${totalForDelete} deudas`;
    }

    void swalAlert
      .fire({
        title: '¿Seguro que deseas continuar?',
        text: message,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'CONFIRMAR',
        cancelButtonText: 'CANCELAR',
      })
      .then((result) => {
        if (result.value) {
          const ids = this.selectedRows.map((items) => items.id);
          this.movementsService.deleteMovements(ids).subscribe(() => {
            this.gaService.sendEvent('EliminarDeudas', {
              event_category: 'Dashboard',
              event_label: 'eliminar_deudas',
            });
            this.consultaDeuda(() => {
              if (totalForDelete === 1) {
                finalMessage = `Se han eliminado ${totalForDelete} registro`;
              }
              if (totalForDelete > 1) {
                finalMessage = `Se han eliminado ${totalForDelete} registros`;
              }

              void swalAlert.fire({
                title: 'Eliminado',
                text: finalMessage,
                showCloseButton: true,
                showCancelButton: false,
                confirmButtonText: 'CERRAR',
              });
            });
            this.selectedAll = false;
            this.selectedUniverse = false;

            this.transactionService.debtItems.data = [];
            this.transactionService.itemsForDelete = [];
            this.selectedRows = [];
          });
        }
      });
  }

  Eliminar(item: Debts) {
    void Swal.fire({
      title: '¿Esta Seguro de Eliminar el Registro? ',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'SI, BORRALO',
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup,
    }).then((result) => {
      if (result.value) {
        this.transactionService.deleteDeuda(item.id).subscribe(() =>
          this.consultaDeuda(() => {
            void Swal.fire(
              'Eliminado',
              'Tu registro ha sido eliminado',
              'success'
            );
          })
        );
      }
    });
  }

  openDialog(service: Partial<CompanyServices>) {
    this.OcultaListaExcel = false;
    this.cargaExcel = false;
    this.excelService.service = service;
    if (this.fileLoad.isRunning()) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '899px',
        backdropClass: 'backdrop-background-opaque',
        // height: '377px',
        // disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: Observable<any>) => {
        dialogRef.componentInstance.ready = false;
        this.fileLoad.verify(this.fileLoadContainer);
        if (result) {
          result.subscribe(() => {
            this.validateResetForm();
          });
        }
      });
    } else {
      this.dialog
        .open(AgregaCobroComponent, { width: '899px' })
        .afterClosed()
        .subscribe((r) => {
          if (r) {
            if (r.medio === 'web') {
              const dlg = this.dialog.open(DebtComponent, {
                width: '330px',
              });
              dlg.afterClosed().subscribe((result) => {
                if (result && result.grabado) {
                  this.validateResetForm();
                }
              });
            } else {
              const dialogRef = this.dialog.open(DialogComponent, {
                width: '899px',
                backdropClass: 'backdrop-background-opaque',
              });
              dialogRef.afterClosed().subscribe((result: Observable<any>) => {
                dialogRef.componentInstance.ready = false;
                this.fileLoad.verify(this.fileLoadContainer);
                if (result) {
                  result.subscribe(() => {
                    this.validateResetForm();
                  });
                }
              });
            }
          }
        });
    }
  }

  DescargarReporte() {
    if (this.enDescarga === false) {
      if (this.transactionService.debtItems.data.length > 0) {
        this.enDescarga = true;
        this.barLoad.show(this.fileLoadContainer);
        this.transactionService.report(this.currentFilter).subscribe(
          (r: Blob) => {
            this.gaService.sendEvent('DescargaReporte', {
              event_category: 'Dashboard',
              event_label: 'descargar_reporte',
            });
            this.barLoad.close();
            this.enDescarga = false;
            saveAs(r, 'Reporte - Interbank_MisCobros.xlsx');
          },
          () => {
            this.barLoad.close();
            this.enDescarga = false;
            this.mensaje(
              'error',
              'Descarga',
              'No se pudo descargar el reporte'
            );
          }
        );
      } else {
        this.mensaje(
          'warning',
          'Descarga',
          'No tiene registros para descargar'
        );
      }
    }
  }

  showDetails(itm: Debts) {
    const dialogRef = this.dialog.open(PaymentDetailComponent, {
      width: '810px',
      disableClose: true,
      data: {
        debtId: itm.id,
        status: itm.status,
        currency: itm.currency,
        customer: {
          name: itm.firstName,
          code: itm.code,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result: { status: string }) => {
      if (isNotNil(prop('status', result))) {
        itm.status = result.status;
        this.consultaDeuda(() => this.tableMovements.updateSelected(itm));
      }
    });
  }

  loadData(args: LazyLoadEvent) {
    const pageSelected = args.first / args.rows + 1;
    if (isNotNilOrEmpty(args.sortField)) {
      this.currentFilter.columnName = args.sortField;
      this.currentFilter.asc = args.sortOrder === 1;
    }
    this.changePage(pageSelected);
  }
}
