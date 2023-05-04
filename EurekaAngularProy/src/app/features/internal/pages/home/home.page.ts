import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { CookieService } from 'ngx-cookie-service';
import { LazyLoadEvent } from 'primeng/api';
import { all, equals, isNil, pathOr, prop } from 'ramda';
import { isNilOrEmpty, isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Observable } from 'rxjs';
import { Debts } from 'src/app/shared/models/debts';
import { DebstFilter } from 'src/app/shared/models/debts-filter.model';
import { User } from 'src/app/shared/models/user.model';
import { WayPay } from 'src/app/shared/models/way-pay';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { LoadBarService } from 'src/app/shared/services/load-bar.service';
import { LoadFileService } from 'src/app/shared/services/load-file.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { drawPopup, swalAlert } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';

import { DateList } from '../../../../shared/models/dateList';
import { MovementsService } from '../../services';
import { AgregaCobroComponent } from './components/agrega-cobro.component';
import { DebtComponent } from './components/debt.component';
import { DialogComponent } from './components/dialog';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { Popover } from './components/popover/popover.service';

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
    private shepherdService: ShepherdService,
    private cookieStorage: CookieService
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
    { name: 'status', asc: false },
  ];
  orderBy = -1;

  // DialogDataExampleDialog
  @ViewChild('cargaExcel', { static: true }) cargaExcel;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  @ViewChild('inputText', { static: true }) inputText: ElementRef;
  @ViewChild('inputDate1', { static: true }) inputDate1: ElementRef;
  @ViewChild('inputDate2', { static: true }) inputDate2: ElementRef;
  state = false;
  public user: User;
  OcultaListaExcel = true;
  typeList: any[];
  waypayList: WayPay[];
  DateList: DateList[];
  type: string[];
  date: string[];
  serviceSelected: string;
  services: any[];
  selectedAll = true;
  selectedUniverse = false;
  selectedAtLeastOneDebt = false;
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
  filtro: DebstFilter = {
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

  innerHeight = 0;

  public enDescarga = false;

  public agregandoDeuda = false;
  public newPartial = false;
  public nuevaDeuda: any = {
    errores: {},
  };
  selectedRows = [];
  tableSortField = '';
  styleTag: HTMLStyleElement;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updatePositionModal();
  }

  ngOnInit() {
    this.fileLoad.onClose.subscribe((m) => {
      if (m.status === 'completed') {
        this.consultaDeuda();
      } else if (m.status === 'rejected') {
        this.excelService.statusUpload = false;
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '899px',
          backdropClass: 'backdrop-background-opaque',
        });
        dialogRef.componentInstance.ready = true;
        dialogRef.componentInstance.rowsAccepted = m.rowsAccepted;
        dialogRef.componentInstance.rowsRejected = m.rowsRejected;
      }
    });
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
    this.styleTag = document.createElement('style');
    this.styleTag.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(this.styleTag);
  }

  ngAfterViewInit(): void {
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
    this.updatePositionModal();
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
    Swal.fire({
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
        } else {
          if (!this.cookieStorage.check('onboarding')) {
            const expire = new Date();
            expire.setDate(expire.getDate() + 25000);
            this.cookieStorage.set('onboarding', '1');
            this.shepherdService.start();
          }
        }

        // this.selectedUniverse = false;
        if (cb) {
          cb();
        }
      });
    this.messageTable = 'Para empezar, agrega la lista de las deudas';
    this.showArrow = true;
  }

  recortarNombres() {
    this.transactionService.debtItems.data.forEach((element) => {
      element.firstName;
    });
  }

  BotonEditar(item: Debts) {
    item.editInput = true;
    item.editButton = true;
    item.editPending =
      item.status === 'PENDIENTE' ||
      (item.status === 'VENCIDO' && item.amountPayed === 0) ||
      item.serviceType === 'S';
    item.newStatus = '1';
    item.newDueDate = item.dueDate;
    item.newEmissionDate = item.emissionDate;
    item.newConcept = item.concept;
    item.newAmount = item.amount.toFixed(2);
    if (item.firstName.trim() === '') {
      item.newFirstName = 'DEUDOR';
    } else {
      item.newFirstName = item.firstName;
    }
    // item.newFirstName = item.firstName;
    item.newLastName = item.lastName;
  }

  saveDebt(item: Debts) {
    Swal.fire({
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

        // {
        //   "emissionDate": "2021-06-16T05:00:00.000Z",
        //   "dueDate": "",
        //   "concept": null,
        //   "amount": 0,
        //   "firstName": "Cliente BBBB21"
        // }

        if (item.newStatus === '1') {
          this.transactionService
            .editDeuda(item.id, debts)
            .subscribe((debtsUpdate) => {
              if (debtsUpdate.success) {
                this.gaService.sendEvent('EditarDeuda', {
                  event_category: 'Dashboard',
                  event_label: 'editar_deuda',
                });
                Swal.fire({
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
                Swal.fire({
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
          const boolean = false;
          this.transactionService
            .updateDeuda(item.id, true)
            .subscribe((statusUpdate) => {
              Swal.fire({
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

  BotonCancela(item: Debts) {
    //  item.edit = false;
    item.editInput = false;
    item.editButton = false;
    item.editPending = false;
    delete item.errores.dueDate;
    delete item.errores.emissionDate;
    delete item.errores.lastName;
    delete item.errores.amount;
    delete item.errores.firstName;
  }

  changePage(nro: number) {
    this.currentFilter.pageNumber = nro;
    this.numeroPagina = nro;
    this.consultaDeuda();
    this.selectedAll = this.transactionService.isMarkedAll(
      this.selectedUniverse
    );
    this.DebtsAreSelected();
  }

  EliminarSeleccionados() {
    const totalForDelete = this.selectedRows.length;
    if (totalForDelete === 0) {
      return;
    }
    let mensaje = '';
    let mensaje_final = '';
    if (totalForDelete === 1) {
      mensaje = `Esta acción va a eliminar ${totalForDelete} deuda`;
    }
    if (totalForDelete > 1) {
      mensaje = `Esta acción va a eliminar ${totalForDelete} deudas`;
    }

    swalAlert
      .fire({
        title: '¿Seguro que deseas continuar?',
        text: mensaje,
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
                mensaje_final =
                  'Se han eliminado ' + totalForDelete + ' registro';
              }
              if (totalForDelete > 1) {
                mensaje_final =
                  'Se han eliminado ' + totalForDelete + ' registros';
              }

              swalAlert.fire({
                title: 'Eliminado',
                text: mensaje_final,
                showCloseButton: true,
                showCancelButton: false,
                confirmButtonText: 'CERRAR',
              });
            });
            this.selectedAll = false;
            this.selectedUniverse = false;

            this.transactionService.debtItems.data = [];
            this.transactionService.itemsForDelete = [];
          });
        }
      });
    this.DebtsAreSelected();
  }

  Eliminar(item: Debts) {
    Swal.fire({
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
            Swal.fire('Eliminado', 'Tu registro ha sido eliminado', 'success');
          })
        );
      }
    });
    this.DebtsAreSelected();
  }

  SeleccionarTodos() {
    if (this.selectedAll) {
      this.transactionService.debtItems.data.forEach((itm) => {
        if (
          (!itm.hasIBKPayments && itm.status !== 'PAGADO') ||
          itm.status == 'PARCIAL'
        ) {
          this.transactionService.deleteDebt(itm.id, (itm.selected = true));
        }
      });
    } else {
      this.selectedUniverse = false;
      this.transactionService.debtItems.data.forEach((itm) =>
        this.transactionService.deleteDebt(itm.id, (itm.selected = false))
      );
    }
    this.DebtsAreSelected();
  }

  openDialog(service: any) {
    this.OcultaListaExcel = false;
    this.cargaExcel = false;
    this.fileLoad.close();
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
            this.consultaDeuda();
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
                  this.consultaDeuda();
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
                    this.consultaDeuda();
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

  estaVencido({ dueDate, status }: Debts): boolean {
    const today = new Date();
    return (
      (status === 'PENDIENTE' || status === 'PARCIAL') &&
      dueDate !== null &&
      dueDate < today
    );
  }

  MontoBlur(e) {
    const initialValue = parseFloat(e.newAmount);
    if (!isNaN(initialValue)) {
      e.newAmount = initialValue.toFixed(2);
    }
  }

  validaEmissionDate(items: Debts) {
    if (!items.newEmissionDate) {
      items.errores.emissionDate = 'Fecha Inválida';
    } else {
      const emidate = new Date(items.newEmissionDate).getFullYear();
      if (emidate < 2000 || emidate > 2050) {
        items.errores.emissionDate = 'Fecha Inválida';
      } else {
        delete items.errores.emissionDate;
      }
    }
  }

  validaDueDate(items: Debts) {
    if (!items.newDueDate) {
      items.errores.dueDate = 'Fecha Inválida';
    } else {
      const dueyear = new Date(items.newDueDate).getFullYear();
      if (dueyear < 2000 || dueyear > 2050) {
        items.errores.dueDate = 'Fecha Inválida';
      } else if (
        items.newEmissionDate &&
        items.newDueDate < items.newEmissionDate
      ) {
        items.errores.dueDate = 'No debe ser menor a la fecha de emisión';
      } else {
        delete items.errores.dueDate;
      }
    }
  }

  private internalValidaNombres(items: Debts) {
    if (items.newFirstName) {
      const re = new RegExp("^[ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]+$");
      if (items.newFirstName.length < 3) {
        items.errores.firstName = 'Debe tener 3 carácteres como mínimo';
      } else if (!re.test(items.newFirstName)) {
        items.errores.firstName = 'No cumple con el formato';
      } else {
        delete items.errores.firstName;
      }
    } else if (!items.newLastName) {
      items.errores.firstName = 'Debe ingresar un valor';
    } else {
      delete items.errores.firstName;
    }
  }

  private internalValidaApellidos(items: Debts) {
    if (items.newLastName) {
      const re = new RegExp("^[ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]+$");
      if (items.newLastName.length < 3) {
        items.errores.lastName = 'Deben tener 3 carácteres como mínimo';
      } else if (!re.test(items.newLastName)) {
        items.errores.lastName = 'No cumple con el formato';
      } else {
        delete items.errores.lastName;
      }
    } else {
      delete items.errores.lastName;
    }
  }

  validaNombresApellidos(items: Debts) {
    this.internalValidaNombres(items);
    this.internalValidaApellidos(items);
  }

  validaMonto(items: Debts) {
    const amount = parseFloat(items.newAmount);
    if (!amount) {
      items.errores.amount = 'Debe ingresar un valor';
    } else if (amount < 0) {
      items.errores.amount = 'Ingrese un monto válido';
    } else if (amount > 999999999.99) {
      items.errores.amount = 'Ingrese un monto válido';
    } else {
      delete items.errores.amount;
    }
  }

  selectForDelete(itm: Debts) {
    this.transactionService.deleteDebt(itm.id, itm.selected);
    this.selectedAll = this.transactionService.isMarkedAll();
    this.DebtsAreSelected();
  }

  showDetails(itm: any) {
    const dialogRef = this.dialog.open(PaymentDetailComponent, {
      width: '810px',
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
    dialogRef.afterClosed().subscribe((result: any) => {
      if (isNotNil(prop('status', result))) {
        itm.status = result.status;
      }
    });
  }

  DebtsAreSelected() {
    this.selectedAtLeastOneDebt =
      this.transactionService.itemsForDelete.length > 0;
  }

  cancelaNuevo() {
    this.agregandoDeuda = false;
    this.nuevaDeuda = { errores: {} };
  }

  grabarNuevo() {
    if (!this.nuevaDeuda.emissionDate) {
      this.nuevaDeuda.errores.emissionDate = 'Fecha Inválida';
    } else {
      const emidate = new Date(this.nuevaDeuda.emissionDate).getFullYear();
      if (emidate < 2000 || emidate > 2050) {
        this.nuevaDeuda.errores.emissionDate = 'Fecha Inválida';
      } else {
        delete this.nuevaDeuda.errores.emissionDate;
      }
    }

    if (this.newPartial) {
      if (!this.nuevaDeuda.dueDate) {
        this.nuevaDeuda.errores.dueDate = 'Fecha Inválida';
      } else {
        const dueyear = new Date(this.nuevaDeuda.dueDate).getFullYear();
        if (dueyear < 2000 || dueyear > 2050) {
          this.nuevaDeuda.errores.dueDate = 'Fecha Inválida';
        } else if (
          this.nuevaDeuda.emissionDate &&
          this.nuevaDeuda.dueDate < this.nuevaDeuda.emissionDate
        ) {
          this.nuevaDeuda.errores.dueDate =
            'No debe ser menor a la fecha de emisión';
        } else {
          delete this.nuevaDeuda.errores.dueDate;
        }
      }

      if (this.nuevaDeuda.code) {
        const re = new RegExp('^[0-9a-zA-Z]+$');
        if (this.nuevaDeuda.code.length < 1) {
          this.nuevaDeuda.errores.code = 'Debe tener 1 carácter como mínimo';
        } else if (!re.test(this.nuevaDeuda.code)) {
          this.nuevaDeuda.errores.code = 'No cumple con el formato';
        } else {
          delete this.nuevaDeuda.errores.code;
        }
      } else if (!this.nuevaDeuda.code) {
        this.nuevaDeuda.errores.code = 'Debe ingresar un valor';
      } else {
        delete this.nuevaDeuda.errores.code;
      }

      if (this.nuevaDeuda.concept) {
        const re = new RegExp('^[0-9a-zA-Z]+$');
        if (this.nuevaDeuda.concept.length < 1) {
          this.nuevaDeuda.errores.concept = 'Debe tener 1 carácter como mínimo';
        } else if (!re.test(this.nuevaDeuda.concept)) {
          this.nuevaDeuda.errores.concept = 'No cumple con el formato';
        } else {
          delete this.nuevaDeuda.errores.concept;
        }
      } else if (!this.nuevaDeuda.concept) {
        this.nuevaDeuda.errores.concept = 'Debe ingresar un valor';
      } else {
        delete this.nuevaDeuda.errores.concept;
      }

      const amount = parseFloat(this.nuevaDeuda.amount);
      if (!amount) {
        this.nuevaDeuda.errores.amount = 'Debe ingresar un valor';
      } else if (amount < 0) {
        this.nuevaDeuda.errores.amount = 'Ingrese un monto válido';
      } else if (amount > 999999999.99) {
        this.nuevaDeuda.errores.amount = 'Ingrese un monto válido';
      } else {
        delete this.nuevaDeuda.errores.amount;
      }
    }

    if (this.nuevaDeuda.firstName) {
      const re = new RegExp("^[ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]+$");
      if (this.nuevaDeuda.firstName.length < 3) {
        this.nuevaDeuda.errores.firstName =
          'Debe tener 3 carácteres como mínimo';
      } else if (!re.test(this.nuevaDeuda.firstName)) {
        this.nuevaDeuda.errores.firstName = 'No cumple con el formato';
      } else {
        delete this.nuevaDeuda.errores.firstName;
      }
    } else if (!this.nuevaDeuda.lastName) {
      this.nuevaDeuda.errores.firstName = 'Debe ingresar un valor';
    } else {
      delete this.nuevaDeuda.errores.firstName;
    }

    for (const s in this.nuevaDeuda.errores) {
      if (this.nuevaDeuda.errores[s]) {
        return;
      }
    }

    Swal.fire({
      title: 'Nueva Deuda',
      text: '¿Deseas continuar?',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'SI, GRABAR',
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup,
    }).then((result) => {
      if (result.value) {
        let debt: any;
        if (this.newPartial) {
          debt = {
            emissionDate: this.nuevaDeuda.emissionDate,
            code: this.nuevaDeuda.code,
            firstName: this.nuevaDeuda.firstName,
          };
        } else {
          debt = {
            emissionDate: this.nuevaDeuda.emissionDate,
            dueDate: this.nuevaDeuda.dueDate,
            code: this.nuevaDeuda.code,
            firstName: this.nuevaDeuda.firstName,
            concept: this.nuevaDeuda.concept,
            amount: this.nuevaDeuda.amount,
          };
        }
        this.homeService
          .postNewDebt(this.nuevaDeuda.service, debt)
          .subscribe((_) => {
            this.agregandoDeuda = false;
            this.nuevaDeuda = { errores: {} };
            this.consultaDeuda();
          });
      }
    });
  }

  cmbNewService() {
    const svc = this.services.find((s) => s.name === this.nuevaDeuda.service);
    this.newPartial = svc.dataType === 'P';
  }

  buscarNewCode() {
    this.homeService
      .getDebtorCode(this.nuevaDeuda.service, this.nuevaDeuda.code)
      .subscribe((d) => {
        if (d.id) {
          this.nuevaDeuda.firstName = d.firstName;
        }
      });
  }

  onSelected(event) {
    this.selectedRows = event;
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
