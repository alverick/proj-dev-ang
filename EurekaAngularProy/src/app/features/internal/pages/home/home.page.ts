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
import * as DOMPurify from 'dompurify';
import * as saveAs from 'file-saver';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import {
  all,
  equals,
  forEachObjIndexed,
  isNil,
  omit,
  pathEq,
  pathOr,
  prop,
} from 'ramda';
import { isNilOrEmpty, isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Observable, Subject } from 'rxjs';

import { CompanyServices } from '../../../../shared/models/company';
import { DateList } from '../../../../shared/models/dateList';
import { Debts } from '../../../../shared/models/debts';
import { DebstFilter } from '../../../../shared/models/debts-filter.model';
import {
  Sections,
  SettingOptions,
  Settings,
  Status,
  StorageSettings,
} from '../../../../shared/models/settings';
import { User } from '../../../../shared/models/user.model';
import { WayPay } from '../../../../shared/models/way-pay';
import {
  ActionEventProperties,
  AdobeAnalyticsService,
  AdobeEvent,
  Metadata,
} from '../../../../shared/services/adobe-analytics.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { HomeService } from '../../../../shared/services/home.service';
import { LoadBarService } from '../../../../shared/services/load-bar.service';
import {
  LoadFileService,
  ModalCloseData,
} from '../../../../shared/services/load-file.service';
import { LoginService } from '../../../../shared/services/login.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { TransactionService } from '../../../../shared/services/transaction.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { MovementsService } from '../../services';
import { AgregaCobroComponent } from './components/agrega-cobro.component';
import { DebtComponent } from './components/debt.component';
import { DialogComponent } from './components/dialog';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { TableMovementsComponent } from './components/table-movements/table-movements.component';

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
    private fileLoad: LoadFileService,
    private barLoad: LoadBarService,
    private movementsService: MovementsService,
    private router: Router,
    private shepherdService: ShepherdService,
    protected adobeAnalytics: AdobeAnalyticsService
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
  items: MenuItem[] = [];
  editRowData: any = {
    canEditFirstName: true,
    canEditEmissionDate: true,
    canEditDueDate: true,
    canEditAmount: true,
    firstName: '',
    emissionDate: '',
    dueDate: '',
    currency: 'S/',
    amount: '',
  };
  displayDialog = false;

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
      this.items = value.map<MenuItem>((item) => ({
        label: `<span class="name">${item.name}</span><span class="type">${
          item.dataType === 'C' ? 'Data completa' : 'Data parcial'
        }</span>`,
        styleClass: 'menu-item-categories',
        escape: false,
        command: () => {
          this.openDialog(item);
        },
      }));
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
          confirmButtonText: 'Cerrar',
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
      action: () => {
        const position = this.getOnboardingPosition();
        const intro = this.shepherdService.tourObject.getById('intro');
        this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
          category: 'Home onboarding',
          action: 'Click',
          detail:
            isNotNil(intro) && position === 0
              ? `Omitir onboarding`
              : `Cerrar onboarding`,
          label: isNotNil(intro) && position === 0 ? `Omitir` : `Cerrar`,
          typeElement: 'Botón',
          location: 'Home onboarding',
        });
        this.shepherdService.cancel();
      },
    };
    const buttonBack = {
      text: 'Atrás',
      classes: 'btn-outline-primary',
      action: () => {
        this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
          category: 'Home onboarding',
          action: 'Click',
          detail: `Atrás en onboarding`,
          label: 'Atrás',
          typeElement: 'Botón',
          location: 'Home onboarding',
        });
        this.shepherdService.back();
      },
    };
    const buttonNext = {
      text: 'Siguiente',
      classes: 'btn-primary',
      action: () => {
        const position = this.getOnboardingPosition();
        const intro = this.shepherdService.tourObject.getById('intro');
        const isFinal =
          position ===
          this.shepherdService.tourObject.steps.length - (isNil(intro) ? 0 : 1);

        this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
          category: 'Home onboarding',
          action: 'Click',
          detail: isFinal ? 'Finalizar onboarding' : `Siguiente en onboarding`,
          label: isFinal ? 'Finalizar' : 'Siguiente',
          typeElement: 'Botón',
          location: 'Home onboarding',
        });
        this.shepherdService.next();
      },
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

  private getOnboardingPosition() {
    const intro = this.shepherdService.tourObject.getById('intro');
    const current = this.shepherdService.tourObject.getCurrentStep();
    return (
      this.shepherdService.tourObject.steps.indexOf(current) +
      (isNil(intro) ? 1 : 0)
    );
  }

  ngOnDestroy(): void {
    this.shepherdService.complete();
  }

  getStepPositionTitle() {
    const tourObject = this.shepherdService.tourObject;
    const intro = tourObject.getById('intro');
    const position = this.getOnboardingPosition();
    const steps = isNil(intro)
      ? tourObject.steps.length
      : tourObject.steps.length - 1;
    return `<i class="pi pi-question-circle tw-pr-2 tw-text-xs"></i>${position} de ${steps}`;
  }

  showOnboarding() {
    this.shepherdService.tourObject.removeStep('intro');
    this.shepherdService.start();
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home filtro',
      action: 'Click',
      detail: 'Abrir Onboarding',
      label: '¿Cómo usar Cobro Simple?',
      typeElement: 'Link',
      location: 'Filtro',
    });
  }

  showHelp() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home filtro',
      action: 'Click',
      detail: 'Abrir tutorial en Youtube',
      label: 'Ver vídeo tutorial',
      typeElement: 'Link',
      location: 'Filtro',
    });
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
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home filtro',
      action: 'Click',
      detail: 'Limpiar filtros',
      label: 'Limpiar filtros',
      typeElement: 'Botón',
      location: 'Filtro',
    });
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

      const formValue = omit(['asc'], this.currentFilter);
      const metadata: Metadata[] = [];
      forEachObjIndexed((value, key) => {
        metadata.push({
          key,
          value: value as string,
        });
      }, formValue);
      const actionStep: Partial<ActionEventProperties> = {
        category: 'Home filtro',
        action: 'Click',
        label: 'Buscar',
        location: 'Filtro',
        step: 'Not available',
        state: 'Envío exitoso',
        metadata,
      };

      this.adobeAnalytics.trackEvent(AdobeEvent.trackFormSubmit, actionStep);
    }
  }

  private submitSearch(inputSearch, service, status, dateForFilter) {
    this.querySearch = true;
    this.resetControlsGrid();
    this.consultaDeuda();

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

  mesageeError(_tipo: any, title: string, text: string) {
    void swalAlert.fire({
      title: title,
      html: text,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Cancelar',
    });
    this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
      category: title,
      action: 'modal-view',
      detail: text,
      location: 'Modal',
    });
  }

  consultaDeuda(cb: () => void = null) {
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
    const username = DOMPurify.sanitize(
      window.sessionStorage.getItem('username')
    );

    const settings: Settings = window.localStorage.getItem(StorageSettings)
      ? (JSON.parse(
          DOMPurify.sanitize(window.localStorage.getItem(StorageSettings))
        ) as Settings)
      : {};
    const saved = pathEq(
      [username, SettingOptions.onBoarding, Sections.movements],
      Status.saved,
      settings
    );
    if (!saved) {
      settings[username] = {
        [SettingOptions.onBoarding]: { [Sections.movements]: Status.saved },
      };
      localStorage.setItem(StorageSettings, JSON.stringify(settings));
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
    this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
      category: '¿Deseas actualizar?',
      action: 'modal-view',
      detail: '¡No podrás revertir esto!',
      location: 'Modal',
    });
    void swalAlert
      .fire({
        title: '¿Deseas actualizar?',
        text: '¡No podrás revertir esto!',
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Si, actualizar',
        cancelButtonText: 'Cerrar',
      })
      .then((result) => {
        if (result.value) {
          const debts = {
            emissionDate: item.emissionDate,
            dueDate: item.dueDate,
            concept: item.concept,
            amount: item.amount,
            firstName: item.firstName,
          };

          let title = 'Editado';
          let text = 'Su registro ha sido editado';

          const metadata: Metadata[] = [];
          forEachObjIndexed((value, key) => {
            metadata.push({
              key,
              value: value as string,
            });
          }, debts);
          const actionStep: Partial<ActionEventProperties> = {
            category: 'Home movimientos',
            action: 'Click',
            label: 'Guardar',
            location: 'Movimientos',
            step: 'Not available',
            state: 'Envío exitoso',
            metadata,
          };

          if (item.newStatus === '1') {
            this.transactionService
              .editDeuda(item.id, debts)
              .subscribe((debtsUpdate) => {
                if (debtsUpdate.success) {
                  void swalAlert.fire({
                    titleText: 'Editado',
                    text: 'Su registro ha sido editado',
                    showCloseButton: true,
                    showCancelButton: false,
                    didClose: () => {
                      this.consultaDeuda();
                    },
                  });
                } else {
                  void swalAlert.fire({
                    titleText: 'ERROR',
                    text: debtsUpdate.message as string,
                    showCloseButton: true,
                    showCancelButton: false,
                  });
                  this.transactionService.resetDebts();
                  title = 'ERROR';
                  text = debtsUpdate.message;
                  actionStep.state = 'Intención de envío';
                  actionStep.typeError = debtsUpdate.message as string;
                }

                this.adobeAnalytics.trackEvent(
                  AdobeEvent.trackFormSubmit,
                  actionStep
                );

                this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
                  category: title,
                  action: 'modal-view',
                  detail: text,
                  location: 'Modal',
                });
              });
          } else if (item.newStatus === '2') {
            this.transactionService
              .updateDeuda(item.id, true)
              .subscribe((statusUpdate) => {
                this.adobeAnalytics.trackEvent(
                  AdobeEvent.trackFormSubmit,
                  actionStep
                );

                this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
                  category: title,
                  action: 'modal-view',
                  detail: text,
                  location: 'Modal',
                });

                void swalAlert.fire({
                  titleText: 'Editado',
                  text: 'Su registro a sido editado',
                  showCloseButton: true,
                  showCancelButton: false,
                  didClose: () => {
                    item.status = 'PAGADO';
                    item.amountPayed = statusUpdate.payed;
                    item.payDate = new Date();
                    item.channel = 'Efectivo';
                    this.showEdit = true;
                    item.newStatus = null;
                    item.editInput = false;
                    item.editButton = false;
                    item.editPending = false;
                  },
                });
              });
          }
        } else {
          this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
            category: 'Home movimientos',
            action: 'Click',
            detail: 'Cancelar editar movimiento',
            label: 'Cerrar',
            typeElement: 'Botón',
            location: 'Movimientos modal',
          });
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

    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Eliminar movimientos seleccionados mostrar modal',
      label: 'Eliminar',
      typeElement: 'Link',
      location: 'Movimientos modal',
    });

    this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
      category: '¿Seguro que deseas continuar?',
      action: 'modal-view',
      detail: message,
      location: 'Modal',
    });

    void swalAlert
      .fire({
        title: '¿Seguro que deseas continuar?',
        text: message,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.value) {
          this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
            category: 'Home movimientos',
            action: 'Click',
            detail: 'Confirmar movimientos seleccionados modal',
            label: 'Confirmar',
            typeElement: 'Link',
            location: 'Movimientos modal',
          });
          const ids = this.selectedRows.map((items) => items.id);
          this.movementsService.deleteMovements(ids).subscribe(() => {
            this.consultaDeuda(() => {
              if (totalForDelete === 1) {
                finalMessage = `Se han eliminado ${totalForDelete} registro`;
              }
              if (totalForDelete > 1) {
                finalMessage = `Se han eliminado ${totalForDelete} registros`;
              }

              this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
                category: 'Eliminado',
                action: 'modal-view',
                detail: finalMessage,
                location: 'Modal',
              });

              void swalAlert.fire({
                title: 'Eliminado',
                text: finalMessage,
                showCloseButton: true,
                showCancelButton: false,
                confirmButtonText: 'Cerrar',
              });
            });
            this.selectedAll = false;
            this.selectedUniverse = false;

            this.transactionService.debtItems.data = [];
            this.transactionService.itemsForDelete = [];
            this.selectedRows = [];
          });
        } else {
          this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
            category: 'Home movimientos',
            action: 'Click',
            detail: 'Cancelar movimientos seleccionados modal',
            label: 'Cancelar',
            typeElement: 'Link',
            location: 'Movimientos modal',
          });
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
      this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
        category: 'Home movimientos',
        action: 'Click',
        detail: 'Agregar cobros',
        label: 'Agregar cobros',
        typeElement: 'Link',
        location: 'Movimientos',
      });

      this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
        category: 'Agrega cobros del servicio',
        action: 'modal-view',
        detail: 'Agrega cobros del servicio',
        location: 'Modal',
      });

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
              this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
                category: 'Home movimientos',
                action: 'Click',
                detail: 'Agregar cobros via web',
                label: 'Agregar en la web',
                typeElement: 'Botón',
                location: 'Movimientos',
              });
              this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
                category: 'Agregar cobro del servicio',
                action: 'modal-view',
                detail: 'Formulario para agregar cobro del servicio',
                location: 'Modal',
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
              this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
                category: 'Home movimientos',
                action: 'Click',
                detail: 'Agregar cobros via excel',
                label: 'Carga excel',
                typeElement: 'Botón',
                location: 'Movimientos',
              });
            }
          } else {
            this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
              category: 'Home movimientos',
              action: 'Click',
              detail: 'Cerrar modal agregar cobros del servicio',
              label: 'Cerrar',
              typeElement: 'Botón',
              location: 'Movimientos',
            });
          }
        });
    }
  }

  DescargarReporte() {
    if (this.enDescarga === false) {
      this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
        category: 'Home movimientos',
        action: 'Click',
        detail: 'Descargar movimientos',
        label: 'Descargar movimientos',
        typeElement: 'Link',
        location: 'Movimientos',
      });
      if (this.transactionService.debtItems.data.length > 0) {
        this.enDescarga = true;
        this.barLoad.show(this.fileLoadContainer);
        this.transactionService.report(this.currentFilter).subscribe(
          (r: Blob) => {
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
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Ver detalle de movimiento',
      label: 'Ver detalle',
      typeElement: 'Link',
      location: 'Movimientos',
    });
    this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
      category: 'Detalle de pago',
      action: 'modal-view',
      detail: 'Información de pago',
      location: 'Modal',
    });
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
    if (pageSelected !== 1) {
      this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
        category: 'Home movimientos',
        action: 'Click',
        detail: 'Cambiar pagina',
        label: `Pagina ${pageSelected}`,
        typeElement: 'Link',
        location: 'Movimientos',
      });
    }
  }
}
