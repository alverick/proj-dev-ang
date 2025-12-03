import { HttpClientModule } from '@angular/common/http';
import { NgZone } from '@angular/core';
import {
  type ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ShepherdService } from 'angular-shepherd';
import { MockService } from 'ng-mocks';
import { type LazyLoadEvent } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { of, Subject } from 'rxjs';
import { Step } from 'shepherd.js';

import { processStatus } from '../../../../shared/constants/process';
import { initialState } from '../../../../shared/mocks/store';
import { type IServiceRemoteModel } from '../../../../shared/models';
import { type CompanyServices } from '../../../../shared/models/company';
import { type DateList } from '../../../../shared/models/dateList';
import { type Debts } from '../../../../shared/models/debts';
import { type User } from '../../../../shared/models/user.model';
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
import { AdobeEvent } from '../../../../shared/services/tracking.service';
import { TransactionService } from '../../../../shared/services/transaction.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { AppConfigActions } from '../../../../store/actions/app-config.actions';
import { CompanyActions } from '../../../../store/actions/company.actions';
import { MovementsService, SelectAllTableService } from '../../services';
import { DialogComponent } from './components/dialog/dialog.component';
import { HomePage } from './home.page';

jest.mock('exceljs', () => ({
  Workbook: jest.fn().mockImplementation(() => ({
    addWorksheet: jest.fn(),
  })),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let store: Store;
  let router: Router;
  let shepherdService: ShepherdService;
  let dynamicDialogService: DynamicDialogService;
  let homeService: HomeService;
  let loginService: LoginService;
  let fileLoad: LoadFileService;
  let settings: SettingsStorageService;
  let storageService: StorageService;
  let ngZone: NgZone;

  const mockUser: User = {
    ruc: '2000000000938',
  };
  const mockService: IServiceRemoteModel = {
    id: 1,
    name: 'Test Service',
    dataType: 'C',
    currency: 'S/',
    debtorCode: '123456',
    idAccount: 'Account1',
    paymentType: 'type1',
  };
  const mockCompanyServices: CompanyServices[] = [
    {
      id: 1,
      name: 'Service 1',
      dataType: 'C',
      idAccount: '',
      debtorCode: '',
      newNameGTPStatus: 0,
      chargeType: 0,
      interestType: '',
      useAgent: false,
      newNameCode: '',
      partialPayment: '',
      paymentType: '',
      newNameCodeGTPStatus: 0,
      useAppWeb: false,
      percentage: null,
      currency: '',
      useAgencyChannel: false,
      res: null,
      inReview: false,
      amount: 0,
      currencySymbol: '',
      accountNumber: '',
      useStore: false,
      chargeInterest: '',
      newName: '',
      debtorCodeType: 0,
      status: '',
    },
    {
      id: 2,
      name: 'Service 2',
      dataType: 'P',
      idAccount: '',
      debtorCode: '',
      newNameGTPStatus: 0,
      chargeType: 0,
      interestType: '',
      useAgent: false,
      newNameCode: '',
      partialPayment: '',
      paymentType: '',
      newNameCodeGTPStatus: 0,
      useAppWeb: false,
      percentage: null,
      currency: '',
      useAgencyChannel: false,
      res: null,
      inReview: false,
      amount: 0,
      currencySymbol: '',
      accountNumber: '',
      useStore: false,
      chargeInterest: '',
      newName: '',
      debtorCodeType: 0,
      status: '',
    },
  ];
  const mockDateList: DateList[] = [{ idDate: '1', descripcion: 'Date 1' }];

  beforeEach(async () => {
    const mockShepherdService = {
      start: jest.fn(),
      addSteps: jest.fn(),
      tourObject: {
        on: jest.fn(),
        getById: jest.fn(),
        removeStep: jest.fn(),
        getCurrentStep: jest.fn(),
        steps: [],
      },
      next: jest.fn(),
      back: jest.fn(),
      cancel: jest.fn(),
      complete: jest.fn(),
      defaultStepOptions: {},
    };

    const mockHomeService = {
      getServices: jest.fn().mockReturnValue(of([mockService])),
      getServicesActive: jest.fn().mockReturnValue(of(mockCompanyServices)),
      getWayPay: jest.fn().mockReturnValue(of([])),
      getDate: jest.fn().mockReturnValue(of(mockDateList)),
    };
    const mockTransactionService = {
      getDeuda: jest
        .fn()
        .mockReturnValue(of({ data: [], count: 0, countNoIbkPayments: 0 })),
      editDeuda: jest.fn().mockReturnValue(of({ success: true })),
      updateDeuda: jest.fn().mockReturnValue(of({ payed: 100 })),
      isMarkedAll: jest.fn(),
      clearMarksForDeletes: jest.fn(),
      resetDebts: jest.fn(),
      report: jest.fn().mockReturnValue(of(new Blob())),
      debtItems: { data: [], count: 0, countNoIbkPayments: 0 },
    };

    const mockStorageService = {
      getCurrentUser: jest.fn().mockReturnValue(mockUser),
      get: jest.fn(),
      set: jest.fn(),
    };

    const mockTrackingService = {
      trackEvent: jest.fn(),
    };

    const mockDynamicDialogService = {
      open: jest
        .fn()
        .mockReturnValue({ onClose: new Subject(), destroy: jest.fn() }),
      closeAll: jest.fn(),
      dialogComponentRefMap: new Map(),
      destroy: new Subject(),
    };
    const mockExcelService = {
      service: null,
      statusUpload: false,
    };
    const mockLoginService = {
      refresh: jest.fn(),
    };
    const mockLoadFileService = {
      onClose: new Subject(),
      verify: jest.fn(),
      close: jest.fn(),
      isRunning: jest.fn().mockReturnValue(false),
    };
    const mockLoadBarService = {
      show: jest.fn(),
      close: jest.fn(),
    };
    const mockMovementsService = {
      deleteMovements: jest.fn().mockReturnValue(of({})),
    };

    const mockSettingsStorageService = {
      getSetting: jest.fn().mockReturnValue(false),
      getSettingAndSave: jest.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), HomePage, HttpClientModule],
      providers: [
        { provide: ShepherdService, useValue: mockShepherdService },
        { provide: HomeService, useValue: mockHomeService },
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: TrackingService, useValue: mockTrackingService },
        { provide: DynamicDialogService, useValue: mockDynamicDialogService },
        { provide: ExcelService, useValue: mockExcelService },
        { provide: LoginService, useValue: mockLoginService },
        { provide: LoadFileService, useValue: mockLoadFileService },
        { provide: LoadBarService, useValue: mockLoadBarService },
        { provide: MovementsService, useValue: mockMovementsService },
        {
          provide: SettingsStorageService,
          useValue: mockSettingsStorageService,
        },
        DynamicDialogRef,
        provideMockStore({ initialState }),
        SelectAllTableService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    router = TestBed.inject(Router);
    shepherdService = TestBed.inject(ShepherdService);
    dynamicDialogService = TestBed.inject(DynamicDialogService);
    homeService = TestBed.inject(HomeService);
    storageService = TestBed.inject(StorageService);
    loginService = TestBed.inject(LoginService);
    fileLoad = TestBed.inject(LoadFileService);
    settings = TestBed.inject(SettingsStorageService);
    ngZone = TestBed.inject(NgZone);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and initialize data', () => {
    jest
      .spyOn((component as any).fileLoad.onClose, 'subscribe')
      .mockImplementation(jest.fn());
    jest.spyOn(component, 'consultaDeuda');
    component.ngOnInit();

    expect(fileLoad.onClose.subscribe).toHaveBeenCalled();
    expect(fileLoad.verify).toHaveBeenCalled();
    expect(storageService.getCurrentUser).toHaveBeenCalled();
    expect(loginService.refresh).toHaveBeenCalled();
    expect(homeService.getServices).toHaveBeenCalled();
    expect(homeService.getServicesActive).toHaveBeenCalled();
    expect(homeService.getWayPay).toHaveBeenCalled();
    expect(homeService.getDate).toHaveBeenCalled();
    expect(component.consultaDeuda).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(CompanyActions.loadCompany());
  });

  it('should call showModalCommissions', () => {
    component.showModalCommissions();
    expect(dynamicDialogService.open).toHaveBeenCalled();
  });

  it('should call showModalCommissions and dispatch action', () => {
    (component as any).showedCommissions = false;
    component.showModalCommissions();
    expect(store.dispatch).toHaveBeenCalledWith(
      AppConfigActions.setModalCommissions({ showed: true }),
    );
    expect(dynamicDialogService.open).toHaveBeenCalled();
  });

  it('should call showModalCommissions and not dispatch action', () => {
    (component as any).showedCommissions = true;
    component.showModalCommissions();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'Set Modal Commissions' }),
    );
    expect(dynamicDialogService.open).not.toHaveBeenCalled();
  });

  it('should call showModalCommissions and navigate to help', () => {
    jest.spyOn(router, 'navigate');
    component.showModalCommissions();
    ngZone.run(() => {
      (component as any).ref.onClose.next('more');
    });
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call showModalCommissions and save settings', () => {
    jest.spyOn(settings, 'getSettingAndSave');
    component.showModalCommissions();
    (component as any).ref.onClose.next('hide');
    expect(settings.getSettingAndSave).toHaveBeenCalled();
  });

  it('should call onClose', fakeAsync(() => {
    const swalAlertFire = swalAlert.fire;
    swalAlert.fire = jest.fn();
    const mockModalCloseData: ModalCloseData = {
      status: processStatus.completed,
      rowsAccepted: 0,
      rowsRejected: 0,
      dataType: 'C',
    };
    fileLoad.onClose.next(mockModalCloseData);
    flush();
    expect(fileLoad.close).toHaveBeenCalled();
    expect(swalAlert.fire).toHaveBeenCalled();
    swalAlert.fire = swalAlertFire;
  }));

  it('should call onClose with rejected status', fakeAsync(() => {
    const mockModalCloseData: ModalCloseData = {
      status: processStatus.rejected,
      rowsAccepted: 0,
      rowsRejected: 0,
      dataType: 'C',
    };
    fileLoad.onClose.next(mockModalCloseData);
    flush();
    expect(fileLoad.close).toHaveBeenCalled();
    expect(dynamicDialogService.open).toHaveBeenCalledWith(
      DialogComponent,
      (component as any).dialogConfig,
    );
  }));

  it('should call ngAfterViewInit', () => {
    jest.spyOn(component as any, 'setOnboarding');
    jest.spyOn(component, 'updatePositionModal');
    component.ngAfterViewInit();
    expect((component as any).setOnboarding).toHaveBeenCalled();
    expect(component.updatePositionModal).toHaveBeenCalled();
  });

  it('should call setOnboarding', () => {
    (component as any).setOnboarding();
    expect(shepherdService.addSteps).toHaveBeenCalled();
  });

  it('should call validateModalAfterOnboarding', () => {
    jest.spyOn(component, 'showModalCommissions');
    (shepherdService as any).tourObject.getById.mockReturnValue({
      id: 'intro',
    });
    component.validateModalAfterOnboarding();
    expect(component.showModalCommissions).toHaveBeenCalled();
  });

  it('should call validateModalAfterOnboarding and dont call showModalCommissions', () => {
    jest.spyOn(component, 'showModalCommissions');
    (shepherdService as any).tourObject.getById.mockReturnValue(null);
    component.validateModalAfterOnboarding();
    expect(component.showModalCommissions).not.toHaveBeenCalled();
  });

  it('should call getOnboardingPosition', () => {
    const steps = [{ id: '1' }, { id: '2' }];
    (shepherdService as any).tourObject.getById.mockReturnValue({
      id: 'intro',
    });
    (shepherdService as any).tourObject.getCurrentStep.mockReturnValue(
      steps[1],
    );
    (shepherdService as any).tourObject.steps = steps;
    const result = (component as any).getOnboardingPosition();
    expect(result).toEqual(1);
  });

  it('should call getOnboardingPosition with out intro', () => {
    const steps = [{ id: '1' }, { id: '2' }];
    (shepherdService as any).tourObject.getById.mockReturnValue(null);
    (shepherdService as any).tourObject.getCurrentStep.mockReturnValue(
      steps[1],
    );
    (shepherdService as any).tourObject.steps = steps;
    const result = (component as any).getOnboardingPosition();
    expect(result).toEqual(2);
  });

  it('should call ngOnDestroy', () => {
    (component as any).ref = {
      onClose: new Subject(),
      destroy: jest.fn(),
    };
    component.ngOnDestroy();
    expect(dynamicDialogService.closeAll).toHaveBeenCalled();
    expect(component.ref.destroy).toHaveBeenCalled();
  });

  it('should call getStepPositionTitle', () => {
    const mockStep1: Step = MockService(Step, { id: '1' });
    const mockStep2: Step = MockService(Step, { id: '2' });

    (shepherdService.tourObject.getById as jest.Mock).mockReturnValue({
      id: 'intro',
    });
    shepherdService.tourObject.steps = [mockStep1, mockStep2];

    jest.spyOn(component as any, 'getOnboardingPosition').mockReturnValue(1);
    const result = component.getStepPositionTitle();
    expect(result).toEqual(
      '<i class="pi pi-question-circle tw-pr-2 tw-text-xs"></i>1 de 1',
    );
  });

  it('should call showOnboarding', () => {
    component.showOnboarding();
    expect(shepherdService.tourObject.removeStep).toHaveBeenCalled();
    expect(shepherdService.start).toHaveBeenCalled();
    expect((component as any).tracking.trackEvent).toHaveBeenCalled();
  });

  it('should call showHelp', () => {
    component.showHelp();
    expect((component as any).tracking.trackEvent).toHaveBeenCalled();
  });

  it('should call updatePositionModal', () => {
    const mockElement = document.createElement('div');
    mockElement.classList.add('movements');
    document.body.appendChild(mockElement);
    component.styleTag = document.createElement('style');
    component.updatePositionModal();
    expect(component.styleTag.innerHTML).toContain('top');
  });

  it('should handle filter reset', () => {
    const mockFilter = {
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
    component.currentFilter = { ...mockFilter };
    component.resetFilterEvt.next(true);
    expect(component.currentFilter).toEqual(mockFilter);
  });

  it('should update table movements inactive state', () => {
    component.tableMovementsInactive = true;
    expect(component.tableMovementsInactive).toBeTruthy();
    component.tableMovementsInactive = false;
    expect(component.tableMovementsInactive).toBeFalsy();
  });

  it('should handle row selection', () => {
    const mockDebt: Debts = {
      id: 1,
      amount: 100,
      currency: 'S/',
      firstName: 'Test',
      status: 'PENDING',
      serviceType: 'Service1',
      code: 'C1',
      emissionDate: '',
      lastName: '',
      service: '',
      concept: '',
      payDate: undefined,
      channel: '',
      hasIBKPayments: false,
      editPending: false,
      editInput: false,
      editButton: false,
    };
    component.selectedRows = [mockDebt];
    expect(component.selectedRows.length).toBe(1);
    expect(component.selectedRows[0]).toEqual(mockDebt);
  });

  it('should handle dialog display', () => {
    component.displayDialog = true;
    expect(component.displayDialog).toBeTruthy();
    component.displayDialog = false;
    expect(component.displayDialog).toBeFalsy();
  });

  it('should handle window resize', () => {
    const updatePositionModalSpy = jest.spyOn(
      component as any,
      'updatePositionModal',
    );
    component.onResize();
    expect(updatePositionModalSpy).toHaveBeenCalled();
  });

  it('should calculate page selected correctly', () => {
    const args: LazyLoadEvent = { first: 10, rows: 10 };
    const changePageSpy = jest.spyOn(component, 'changePage');
    component.loadData(args);
    expect(changePageSpy).toHaveBeenCalledTimes(1);
    expect(changePageSpy).toHaveBeenCalledWith(2);
  });

  it('should update sorting field', () => {
    const args: LazyLoadEvent = {
      first: 0,
      rows: 10,
      sortField: 'test',
      sortOrder: 1,
    };
    component.loadData(args);
    expect(component.currentFilter.columnName).toBe('test');
    expect(component.currentFilter.asc).toBe(true);
  });

  it('should call changePage', () => {
    const args: LazyLoadEvent = { first: 0, rows: 10 };
    const changePageSpy = jest.spyOn(component, 'changePage');
    component.loadData(args);
    expect(changePageSpy).toHaveBeenCalledTimes(1);
  });

  it('should track event for non-first page', () => {
    const args: LazyLoadEvent = { first: 10, rows: 10 };
    component.loadData(args);
    expect((component as any).tracking.trackEvent).toHaveBeenCalledTimes(1);
    expect((component as any).tracking.trackEvent).toHaveBeenCalledWith(
      AdobeEvent.trackAction,
      expect.objectContaining({
        category: 'Home movimientos',
        action: 'Click',
        detail: 'Cambiar pagina',
        label: 'Pagina 2',
        typeElement: 'Link',
        location: 'Movimientos',
      }),
    );
  });

  it('should not track event for first page', () => {
    const args: LazyLoadEvent = { first: 0, rows: 10 };
    component.loadData(args);
    expect((component as any).tracking.trackEvent).not.toHaveBeenCalled();
  });

  it('should handle empty sort field', () => {
    const args: LazyLoadEvent = { first: 0, rows: 10, sortField: '' };
    component.loadData(args);
    expect(component.currentFilter.columnName).toBe('');
    expect(component.currentFilter.asc).toBe(true);
  });
});
