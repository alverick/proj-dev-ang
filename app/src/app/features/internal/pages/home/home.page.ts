import { DatePipe, NgClass } from '@angular/common';
import {
  type AfterViewInit,
  Component,
  HostListener,
  inject,
  type OnDestroy,
  type OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ShepherdService } from 'angular-shepherd';
import { saveAs } from 'file-saver';
import { type LazyLoadEvent, type MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonDirective } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Ripple } from 'primeng/ripple';
import { SplitButton, SplitButtonModule } from 'primeng/splitbutton';
import {
  all,
  equals,
  forEachObjIndexed,
  isNil,
  omit,
  pathOr,
  prop,
} from 'ramda';
import { isNilOrEmpty, isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { type Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PaymentsFilterComponent } from '../../../../shared/components/payments-filter/payments-filter.component';
import { type CurrencyWithLimit } from '../../../../shared/constants/currencies';
import { processStatus } from '../../../../shared/constants/process';
import type { IServiceRemoteModel } from '../../../../shared/models';
import { type CompanyServices } from '../../../../shared/models/company';
import { type DateList } from '../../../../shared/models/dateList';
import { type Debts } from '../../../../shared/models/debts';
import { type DebstFilter } from '../../../../shared/models/debts-filter.model';
import { Sections, SettingOptions } from '../../../../shared/models/settings';
import { type User } from '../../../../shared/models/user.model';
import { type WayPay } from '../../../../shared/models/way-pay';
import {
  SettingsStorageService,
  TrackingService,
} from '../../../../shared/services';
import { DynamicDialogService } from '../../../../shared/services/dynamic-dialog.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { HomeService } from '../../../../shared/services/home.service';
import { LoadBarService } from '../../../../shared/services/load-bar.service';
import {
  LoadFileService,
  type ModalCloseData,
} from '../../../../shared/services/load-file.service';
import { LoginService } from '../../../../shared/services/login.service';
import { StorageService } from '../../../../shared/services/storage.service';
import {
  type ActionEventProperties,
  AdobeEvent,
  type Metadata,
} from '../../../../shared/services/tracking.service';
import { TransactionService } from '../../../../shared/services/transaction.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { AppConfigActions } from '../../../../store/actions/app-config.actions';
import { CompanyActions } from '../../../../store/actions/company.actions';
import { appConfigFeature } from '../../../../store/reducers/app-config.reducer';
import { companyFeature } from '../../../../store/reducers/company.reducer';
import { sectionCommissions } from '../../constants';
import { internalFullRoutingNames } from '../../internal-routing.names';
import { MovementsService } from '../../services';
import { AgregaCobroComponent } from './components/agrega-cobro.component';
import { CommissionsInfoComponent } from './components/comissions-info/commissions-info.component';
import { DebtComponent } from './components/debt.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogHeaderComponent } from './components/dialog-header/dialog-header.component';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { TableMovementsComponent } from './components/table-movements/table-movements.component';

export type DebtDialog = {
  currency: string;
  customer: { code: string; name: string };
  debtId: number;
  serviceType: string;
  status: string;
};

@Component({
  selector: 'cs-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  providers: [DatePipe, TransactionService],
  imports: [
    BadgeModule,
    PaymentsFilterComponent,
    NgClass,
    ButtonDirective,
    Ripple,
    SplitButtonModule,
    TableMovementsComponent,
  ],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  ref: DynamicDialogRef;
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
  serviceSelected: Partial<IServiceRemoteModel>;
  services: Partial<IServiceRemoteModel>[];
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
  amountLimits: CurrencyWithLimit[] = [];
  useAmountLimits = false;
  private showedCommissions: boolean;
  private readonly onboardingIntro = 'intro';

  protected dialogConfig: DynamicDialogConfig = {
    width: '899px',
    styleClass: 'upload-files-dialog modal-custom-cs',
    templates: {
      header: DialogHeaderComponent,
    },
    maskStyleClass: 'upload-files-dialog',
    focusOnShow: false,
    header: 'Agrega cobros del servicio Servicio usuario nuevo',
    data: {
      amountLimits: this.amountLimits,
      useAmountLimits: this.useAmountLimits,
    },
  };

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updatePositionModal();
  }

  datePipe = inject(DatePipe);

  constructor(
    private readonly storageService: StorageService,
    private readonly homeService: HomeService,
    public transactionService: TransactionService,
    public excelService: ExcelService,
    private readonly loginService: LoginService,
    private readonly fileLoad: LoadFileService,
    private readonly barLoad: LoadBarService,
    private readonly movementsService: MovementsService,
    private readonly router: Router,
    private readonly shepherdService: ShepherdService,
    protected tracking: TrackingService,
    private readonly store: Store,
    public dynamicDialogService: DynamicDialogService,
    public settings: SettingsStorageService,
  ) {
    transactionService.itemsForDelete = [];
    const navigation = this.router.getCurrentNavigation();
    let form = pathOr(null, ['extras', 'state', 'filter'], navigation);
    if (isNotNil(form)) {
      form = { ...form, payment: form.payment.code };
    }
    this.formValues = form;
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
    this.store.dispatch(CompanyActions.loadCompany());
    this.store
      .select(companyFeature.selectCurrencyLimits)
      .pipe(filter((data) => isNotNilOrEmpty(data)))
      .subscribe((data) => {
        this.amountLimits = data;
      });
    this.store
      .select(companyFeature.selectUseAmountLimits)
      .subscribe((useLimits) => {
        this.useAmountLimits = useLimits;
      });
    this.store
      .select(appConfigFeature.selectShowedCommission)
      .subscribe((data) => {
        this.showedCommissions = data;
      });
  }

  showModalCommissions(auto = true) {
    const showed = this.settings.getSetting(
      SettingOptions.commissions,
      Sections.movements,
    );

    if (this.showedCommissions && auto) return;

    if (showed && auto) return;

    if (!this.showedCommissions) {
      this.store.dispatch(
        AppConfigActions.setModalCommissions({ showed: true }),
      );
    }

    this.ref = this.dynamicDialogService.open(CommissionsInfoComponent, {
      header: 'Conoce las nuevas comisiones por cobranza en canales digitales',
      styleClass: 'tw-w-[54rem]',
      data: {
        showed: showed || !auto,
        detail:
          'Modal informativo sobre las nuevas comisiones de cobranza en canales digitales',
      },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((action: string) => {
      if (action === 'more') {
        void this.router.navigate([internalFullRoutingNames.HELP], {
          state: { section: sectionCommissions },
        });
      }
      if (action === 'hide') {
        this.settings.getSettingAndSave(
          SettingOptions.commissions,
          Sections.movements,
        );
      }
    });
  }

  private onClose() {
    return (m: ModalCloseData) => {
      if (m.status === processStatus.completed) {
        this.fileLoad.close();
        let msg = '';
        if (m.dataType === 'C') {
          msg = `¡Listo! Se agregaron nuevas deudas `;
        } else {
          msg = `¡Listo! Se agregaron nuevos clientes`;
        }
        void swalAlert.fire({
          title: msg,
          text: 'Recuerda que puedes eliminar y/o editar los datos de tus clientes desde la página de movimientos.',
          showCloseButton: true,
          confirmButtonText: 'Cerrar',
          didClose: () => {
            this.validateResetForm();
          },
        });
      } else if (m.status === processStatus.failed) {
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
      } else if (m.status === processStatus.rejected) {
        this.fileLoad.close();
        this.excelService.statusUpload = false;
        const dialogRef = this.dynamicDialogService.open(
          DialogComponent,
          this.dialogConfig,
        );

        const dialogComponentRef =
          this.dynamicDialogService.dialogComponentRefMap.get(dialogRef);
        dialogComponentRef?.changeDetectorRef?.detectChanges();
        const component = dialogComponentRef?.instance.componentRef
          .instance as DialogComponent;
        if (component) {
          component.ready = true;
          component.rowsAccepted = m.rowsAccepted;
          component.rowsRejected = m.rowsRejected;
        }
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
        const intro = this.shepherdService.tourObject.getById(
          this.onboardingIntro,
        );
        this.tracking.trackEvent(AdobeEvent.trackAction, {
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

        if (isNotNil(intro)) {
          this.showModalCommissions();
        }
      },
    };
    const buttonBack = {
      text: 'Atrás',
      classes: 'btn-outline-primary',
      action: () => {
        this.tracking.trackEvent(AdobeEvent.trackAction, {
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
        const intro = this.shepherdService.tourObject.getById(
          this.onboardingIntro,
        );
        const isFinal =
          position ===
          this.shepherdService.tourObject.steps.length - (isNil(intro) ? 0 : 1);

        this.tracking.trackEvent(AdobeEvent.trackAction, {
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
        id: this.onboardingIntro,
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
          element: '[data-onboarding="add-deuda"]',
          on: 'bottom',
        },
        buttons: [{ ...buttonSkip, text: 'Cerrar' }, buttonNext],
        classes: 'tw-translate-y-2',
        highlightClass: 'highlight',
        title: () => this.getStepPositionTitle(),
        text: '<h4 class="tw-font-medium tw-pb-2">Agrega cobros</h4><p class="tw-text-sm">El primer paso es agregar cobros. Puedes hacerlo de manera individual o masiva con nuestra plantilla de Excel.</p>',
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
          element: '[data-onboarding="movements"]',
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
          element: '[data-onboarding="filters"]',
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
          element: '[data-onboarding="services"]',
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
          element: '[data-onboarding="company"]',
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
          element: '[data-onboarding="notifications"]',
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

    this.shepherdService.tourObject.on('cancel', () => {
      this.validateModalAfterOnboarding();
    });
    this.shepherdService.tourObject.on('complete', () => {
      this.validateModalAfterOnboarding();
    });
  }

  validateModalAfterOnboarding() {
    const intro = this.shepherdService.tourObject.getById(this.onboardingIntro);
    if (isNotNil(intro)) {
      this.showModalCommissions();
    }
  }

  private getOnboardingPosition() {
    const intro = this.shepherdService.tourObject.getById(this.onboardingIntro);
    const current = this.shepherdService.tourObject.getCurrentStep();
    return (
      this.shepherdService.tourObject.steps.indexOf(current) +
      (isNil(intro) ? 1 : 0)
    );
  }

  ngOnDestroy(): void {
    if (this.shepherdService.isActive) {
      this.shepherdService.complete();
    }
    this.dynamicDialogService.closeAll();
    if (isNotNil(this.ref)) this.ref.destroy();
  }

  getStepPositionTitle() {
    const tourObject = this.shepherdService.tourObject;
    const intro = tourObject.getById(this.onboardingIntro);
    const position = this.getOnboardingPosition();
    const steps = isNil(intro)
      ? tourObject.steps.length
      : tourObject.steps.length - 1;
    return `<i class="pi pi-question-circle tw-pr-2 tw-text-xs"></i>${position} de ${steps}`;
  }

  showOnboarding() {
    this.shepherdService.tourObject.removeStep(this.onboardingIntro);
    this.shepherdService.start();
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home filtro',
      action: 'Click',
      detail: 'Abrir Onboarding',
      label: '¿Cómo usar Cobro Simple?',
      typeElement: 'Link',
      location: 'Filtro',
    });
  }

  showHelp() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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

      this.tracking.trackEvent(AdobeEvent.trackFormSubmit, actionStep);
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
    this.tracking.trackEvent(AdobeEvent.trackView, {
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
            this.selectedUniverse,
          );
        }
        this.validateOnboarding(
          this.transactionService.debtItems.data.length > 0,
        );
        if (cb) {
          cb();
        }
      });
    this.messageTable = 'Para empezar, agrega la lista de las deudas';
    this.showArrow = true;
  }

  validateOnboarding(hasRecords: boolean) {
    const saved = this.settings.getSettingAndSave(
      SettingOptions.onBoarding,
      Sections.movements,
    );

    if (!hasRecords && !saved) {
      this.shepherdService.start();
    } else {
      this.showModalCommissions();
    }
  }

  saveDebt(item: Debts) {
    this.tracking.trackEvent(AdobeEvent.trackView, {
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
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.value) {
          const debts = {
            emissionDate: this.datePipe.transform(
              item.emissionDate,
              'dd/MM/yyyy',
            ),
            dueDate: this.datePipe.transform(item.dueDate, 'dd/MM/yyyy'),
            concept: item.concept,
            amount: item.amount,
            firstName: item.firstName,
          };

          let title = 'Editado';
          let text = 'Su registro ha sido editado.';

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
                    text: 'Su registro ha sido editado.',
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

                this.tracking.trackEvent(
                  AdobeEvent.trackFormSubmit,
                  actionStep,
                );

                this.tracking.trackEvent(AdobeEvent.trackView, {
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
                this.tracking.trackEvent(
                  AdobeEvent.trackFormSubmit,
                  actionStep,
                );

                this.tracking.trackEvent(AdobeEvent.trackView, {
                  category: title,
                  action: 'modal-view',
                  detail: text,
                  location: 'Modal',
                });

                void swalAlert.fire({
                  titleText: 'Editado',
                  text: 'Su registro a sido editado.',
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
          this.tracking.trackEvent(AdobeEvent.trackAction, {
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
      this.selectedUniverse,
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
      message = `Esta acción va a eliminar ${totalForDelete} deuda.`;
    }
    if (totalForDelete > 1) {
      message = `Esta acción va a eliminar ${totalForDelete} deudas.`;
    }

    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Eliminar movimientos seleccionados mostrar modal',
      label: 'Eliminar',
      typeElement: 'Link',
      location: 'Movimientos modal',
    });

    this.tracking.trackEvent(AdobeEvent.trackView, {
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
          this.tracking.trackEvent(AdobeEvent.trackAction, {
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
                finalMessage = `Se han eliminado ${totalForDelete} registro.`;
              }
              if (totalForDelete > 1) {
                finalMessage = `Se han eliminado ${totalForDelete} registros.`;
              }

              this.tracking.trackEvent(AdobeEvent.trackView, {
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
          this.tracking.trackEvent(AdobeEvent.trackAction, {
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
      const dialogRef = this.dynamicDialogService.open(
        DialogComponent,
        this.dialogConfig,
      );
      dialogRef.onClose.subscribe((result: Observable<unknown>) => {
        this.fileLoad.verify(this.fileLoadContainer);
        if (result) {
          result.subscribe(() => {
            this.validateResetForm();
          });
        }
      });
    } else {
      this.tracking.trackEvent(AdobeEvent.trackAction, {
        category: 'Home movimientos',
        action: 'Click',
        detail: 'Agregar cobros',
        label: 'Agregar cobros',
        typeElement: 'Link',
        location: 'Movimientos',
      });

      this.tracking.trackEvent(AdobeEvent.trackView, {
        category: 'Agrega cobros del servicio',
        action: 'modal-view',
        detail: 'Agrega cobros del servicio',
        location: 'Modal',
      });

      this.dynamicDialogService
        .open(AgregaCobroComponent, {
          width: '899px',
          footer: ' ',
          header: 'Agrega cobros del servicio Servicio usuario nuevo',
          styleClass: 'modal-custom-cs',
          style: { 'max-height': 'none' },
          dismissableMask: true,
          focusOnShow: false,
          focusTrap: false,
          templates: {
            header: DialogHeaderComponent,
          },
          data: {
            amountLimits: this.amountLimits,
            useAmountLimits: this.useAmountLimits,
          },
        })
        .onClose.subscribe((r) => {
          if (r) {
            if (r.medio === 'web') {
              this.dynamicDialogService
                .open(DebtComponent, {
                  width: '450px',
                  footer: ' ',
                  header: 'Agrega cobros del servicio Servicio usuario nuevo',
                  styleClass: 'modal-custom-cs modal-thin',
                  style: { 'max-height': 'none' },
                  dismissableMask: true,
                  focusOnShow: false,
                  focusTrap: false,
                  templates: {
                    header: DialogHeaderComponent,
                  },
                  data: {
                    amountLimits: this.amountLimits,
                    useAmountLimits: this.useAmountLimits,
                  },
                })
                .onClose.subscribe((result) => {
                  if (result?.grabado) {
                    this.validateResetForm();
                  }
                });
              this.tracking.trackEvent(AdobeEvent.trackAction, {
                category: 'Home movimientos',
                action: 'Click',
                detail: 'Agregar cobros via web',
                label: 'Agregar en la web',
                typeElement: 'Botón',
                location: 'Movimientos',
              });
              this.tracking.trackEvent(AdobeEvent.trackView, {
                category: 'Agregar cobro del servicio',
                action: 'modal-view',
                detail: 'Formulario para agregar cobro del servicio',
                location: 'Modal',
              });
            } else {
              const dialogRef = this.dynamicDialogService.open(
                DialogComponent,
                this.dialogConfig,
              );
              dialogRef.onClose.subscribe((result: Observable<unknown>) => {
                this.fileLoad.verify(this.fileLoadContainer);
                if (result) {
                  result.subscribe(() => {
                    this.validateResetForm();
                  });
                }
              });
              this.tracking.trackEvent(AdobeEvent.trackAction, {
                category: 'Home movimientos',
                action: 'Click',
                detail: 'Agregar cobros via excel',
                label: 'Carga excel',
                typeElement: 'Botón',
                location: 'Movimientos',
              });
            }
          } else {
            this.tracking.trackEvent(AdobeEvent.trackAction, {
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
      this.tracking.trackEvent(AdobeEvent.trackAction, {
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
        this.transactionService.report(this.currentFilter).subscribe({
          next: (r: Blob) => {
            this.barLoad.close();
            this.enDescarga = false;
            saveAs(r, 'Reporte - Interbank_MisCobros.xlsx');
          },
          error: () => {
            this.barLoad.close();
            this.enDescarga = false;
            this.mensaje(
              'error',
              'Descarga',
              'No se pudo descargar el reporte',
            );
          },
        });
      } else {
        this.mensaje(
          'warning',
          'Descarga',
          'No tiene registros para descargar',
        );
      }
    }
  }

  showDetails(itm: Debts) {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Ver detalle de movimiento',
      label: 'Ver detalle',
      typeElement: 'Link',
      location: 'Movimientos',
    });
    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: 'Detalle de pago',
      action: 'modal-view',
      detail: 'Información de pago',
      location: 'Modal',
    });
    const dialogData: DebtDialog = {
      debtId: itm.id,
      status: itm.status,
      serviceType: itm.serviceType,
      currency: itm.currency,
      customer: {
        name: itm.firstName,
        code: itm.code,
      },
    };
    const dialogRef = this.dynamicDialogService.open(PaymentDetailComponent, {
      width: '810px',
      modal: true,
      showHeader: false,
      closeOnEscape: false,
      styleClass: 'simple-dialog',
      data: dialogData,
    });
    dialogRef.onClose.subscribe((result: { status: string }) => {
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
      this.tracking.trackEvent(AdobeEvent.trackAction, {
        category: 'Home movimientos',
        action: 'Click',
        detail: 'Cambiar pagina',
        label: `Pagina ${pageSelected}`,
        typeElement: 'Link',
        location: 'Movimientos',
      });
    }
  }

  clickSplitButton(event: SplitButton, eventClick: MouseEvent): void {
    setTimeout(() => {
      event.onDropdownButtonClick(eventClick);
    }, 0);
  }
}
