import { signal, type WritableSignal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import type * as ExcelJS from 'exceljs';
import { MockProvider, MockProviders } from 'ng-mocks';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { of, Subject } from 'rxjs';

import { MessageAlertComponent } from '../../../../../../shared/components/message-alert/message-alert.component';
import {
  fileUploadExampleTest,
  fileUploadExampleTestMessage,
} from '../../../../../../shared/constants/fileload-messages';
import {
  processStatus,
  type StatusValues,
} from '../../../../../../shared/constants/process';
import { ServiceTypes } from '../../../../../../shared/constants/services';
import {
  ExcelService,
  type ProcessStatus,
} from '../../../../../../shared/services/excel.service';
import { StorageService } from '../../../../../../shared/services/storage.service';
import {
  type ActionEventProperties,
  TrackingService,
} from '../../../../../../shared/services/tracking.service';
import { DialogComponent } from './dialog.component';

interface MockWorkbook {
  xlsx: {
    load: jest.Mock;
  };
  getWorksheet: jest.Mock;
}

const mockWorkbook: MockWorkbook = {
  xlsx: {
    load: jest.fn().mockResolvedValue(true),
  },
  getWorksheet: jest.fn().mockReturnValue({
    rowCount: 20,
    getRow: jest.fn().mockReturnValue({
      getCell: jest.fn().mockReturnValue({ value: 'Test Service' }),
    }),
    getRows: jest.fn().mockReturnValue([]),
    lastRow: { number: 20 },
  }),
};

jest.mock('exceljs', () => ({
  Workbook: jest.fn().mockImplementation(() => mockWorkbook),
}));

class TestDialogComponent extends DialogComponent {
  public callVerifyStatus() {
    return this.verifyStatus();
  }

  public callIsProcessing(status: ProcessStatus): boolean {
    return this['isProcessing'](status);
  }

  public callHandleStatus(
    status: ProcessStatus,
    actionStep: Partial<ActionEventProperties>,
  ) {
    return this['handleStatus'](status, actionStep);
  }

  public callHandleInProgressStatus(status: ProcessStatus) {
    return this['handleInProgressStatus'](status);
  }
}

describe('DialogComponent', () => {
  let component: TestDialogComponent;
  let fixture: ComponentFixture<TestDialogComponent>;
  let excelService: jest.Mocked<ExcelService>;
  let isProcessActiveSignal: WritableSignal<boolean>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  const createMockRow = (props: Partial<ExcelJS.Row> = {}): ExcelJS.Row =>
    ({
      number: 15,
      getCell: jest.fn(),
      actualCellCount: 6,
      worksheet: {} as any,
      hasValues: true,
      dimensions: {} as any,
      model: {} as any,
      height: 0,
      hidden: false,
      values: [],
      collapsed: false,
      outlineLevel: 0,
      rowNumber: 1,
      cellCount: 6,
      ...props,
    }) as ExcelJS.Row;

  beforeEach(async () => {
    isProcessActiveSignal = signal(false);
    await TestBed.configureTestingModule({
      imports: [
        TestDialogComponent,
        ReactiveFormsModule,
        FileUploadModule,
        ProgressBarModule,
        MessageAlertComponent,
      ],
      providers: [
        UntypedFormBuilder,
        MockProvider(ExcelService, {
          service: {
            dataType: ServiceTypes.complete,
            name: 'Test Service',
            currencySymbol: 'USD',
          },
          isProcessActive: isProcessActiveSignal,
          errores: [],
        }),
        MockProvider(DynamicDialogRef, {
          onClose: of(true),
        }),
        MockProvider(DynamicDialogConfig, {
          data: {
            useAmountLimits: true,
            amountLimits: [{ symbol: 'USD', limitMax: 1000 }],
          },
        }),
        MockProviders(StorageService, TrackingService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDialogComponent);
    component = fixture.componentInstance;
    excelService = TestBed.inject(ExcelService) as jest.Mocked<ExcelService>;
    dialogRef = TestBed.inject(DynamicDialogRef);
    config = TestBed.inject(DynamicDialogConfig);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.inputXlsForm).toBeDefined();
    expect(component.inputXlsForm.get('xls')).toBeDefined();
  });

  it('should set useAmountLimits and limitAmountMax from config', () => {
    component.ngOnInit();
    expect(component.useAmountLimits).toBe(true);
    expect(component.limitAmountMax).toBe(1000);
  });

  it('should reset errors when dialog is closed without upload', () => {
    isProcessActiveSignal.set(false);
    excelService.errores = [{ description: 'test error', row: 1 }];
    component.ngOnInit();
    dialogRef.close();
    expect(excelService.errores).toEqual([]);
  });

  it('should calculate correct rowStart for complete service type', () => {
    expect(component.rowStart()).toBe(14);
  });

  it('should calculate correct rowStart for partial service type', () => {
    excelService.service.dataType = ServiceTypes.partial;
    expect(component.rowStart()).toBe(10);
  });

  describe('validateFile', () => {
    beforeEach(() => {
      component.uploaderFiles = [new File([''], 'test.xlsx')];
    });

    it('should validate file and return errors if file is too short', async () => {
      const shortWorkbook: MockWorkbook = {
        xlsx: { load: jest.fn().mockResolvedValue(true) },
        getWorksheet: jest.fn().mockReturnValue({
          rowCount: 5,
          getRow: jest.fn().mockReturnValue({
            getCell: jest.fn().mockReturnValue({ value: 'Test Service' }),
          }),
          lastRow: { number: 5 },
        }),
      };

      const mockFileReader = {
        readAsArrayBuffer: jest.fn().mockImplementation(function (
          this: any,
          blob: Blob,
        ) {
          const reader = this;
          setTimeout(() => {
            Object.defineProperty(reader, 'result', {
              value: new ArrayBuffer(0),
              writable: true,
            });
            reader.onloadend?.call(reader);
          }, 0);
        }),
        onloadend: null,
        result: null,
      } as unknown as FileReader;
      jest
        .spyOn(window, 'FileReader')
        .mockImplementation(() => mockFileReader as any);

      const mockExcelJS = jest.requireMock('exceljs');
      mockExcelJS.Workbook.mockImplementation(() => shortWorkbook);

      const errors = await component.validateFile();
      expect(errors).toEqual([
        {
          description: 'El archivo no contiene registros válidos',
          row: 0,
        },
      ]);
    });

    it('should validate file and check service name', async () => {
      excelService.service.name = 'Different Service';
      const mockExcelJS = jest.requireMock('exceljs');
      mockExcelJS.Workbook.mockImplementation(() => mockWorkbook);
      const errors = await component.validateFile();
      expect(
        errors.some(
          (error) =>
            error.description === 'El nombre del servicio no es correcto',
        ),
      ).toBe(true);
    });

    it('should validate file and return error when exceeding 5000 records', async () => {
      const largeWorkbook: MockWorkbook = {
        xlsx: { load: jest.fn().mockResolvedValue(true) },
        getWorksheet: jest.fn().mockReturnValue({
          rowCount: 5015,
          getRow: jest.fn().mockReturnValue({
            getCell: jest.fn().mockReturnValue({ value: 'Test Service' }),
          }),
          getRows: jest.fn().mockReturnValue([]),
          lastRow: { number: 5015 },
        }),
      };

      const mockExcelJS = jest.requireMock('exceljs');
      mockExcelJS.Workbook.mockImplementation(() => largeWorkbook);

      const errors = await component.validateFile();
      expect(
        errors.some(
          (error) =>
            error.description ===
            'Se ha superado el límite de 5000 registros por archivo excel',
        ),
      ).toBe(true);
    });

    it('should handle duplicate uploads of the same file', async () => {
      component.lastRows = [20];
      const mockExcelJS = jest.requireMock('exceljs');
      mockExcelJS.Workbook.mockImplementation(() => mockWorkbook);
      const errors = await component.validateFile();
      expect(errors.length).toBe(0);
    });
  });

  describe('validateRow', () => {
    it('should validate first row headers for complete service type', () => {
      const mockRow = {
        number: 14,
        getCell: jest.fn().mockReturnValue({ value: fileUploadExampleTest }),
      } as unknown as ExcelJS.Row;

      const errors = component.validateRow(mockRow);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].description).toContain(fileUploadExampleTestMessage);
    });

    it('should validate first row headers for partial service type', () => {
      excelService.service.dataType = ServiceTypes.partial;
      const mockRow = {
        number: 10,
        getCell: jest.fn().mockReturnValue({ value: fileUploadExampleTest }),
      } as unknown as ExcelJS.Row;

      const errors = component.validateRow(mockRow);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].description).toContain(fileUploadExampleTestMessage);
    });
  });

  describe('progress handling', () => {
    it('should initialize progress object correctly', () => {
      expect(component.progress).toEqual({
        status: 'Subiendo',
        mode: 'indeterminate',
        value: 0,
      });
    });

    it('should track accepted and rejected rows', () => {
      component.rowsAccepted = 5;
      component.rowsRejected = 3;
      expect(component.rowsAccepted).toBe(5);
      expect(component.rowsRejected).toBe(3);
    });
  });

  describe('row validation for complete service type', () => {
    let mockRow: ExcelJS.Row;

    beforeEach(() => {
      excelService.service.dataType = ServiceTypes.complete;
      mockRow = createMockRow();
    });

    it('should handle invalid date string', () => {
      (mockRow.getCell as jest.Mock).mockImplementation((idx) => ({
        value: idx === 1 ? 'invalid-date' : 'some value',
      }));

      const errors = component.validateRow(mockRow);
      expect(
        errors.some((e) => e.description.includes('no es una fecha válida')),
      ).toBe(true);
    });

    it('should validate valid dates', () => {
      const validDate = new Date();
      (mockRow.getCell as jest.Mock).mockImplementation((idx) => ({
        value: idx <= 2 ? validDate : 'some value',
      }));

      const errors = component.validateRow(mockRow);
      expect(errors.length).toBe(0);
    });

    it('should validate valid date string format', () => {
      (mockRow.getCell as jest.Mock).mockImplementation((idx) => ({
        value: idx <= 2 ? '01/01/2024' : 'some value',
      }));

      const errors = component.validateRow(mockRow);
      expect(errors.length).toBe(0);
    });

    it('should reject invalid date format', () => {
      (mockRow.getCell as jest.Mock).mockImplementation((idx) => ({
        value: idx === 1 ? '2024-01-01' : 'some value',
      }));

      const errors = component.validateRow(mockRow);
      expect(
        errors.some((e) => e.description.includes('no es una fecha válida')),
      ).toBe(true);
    });

    it('should validate valid amount', () => {
      (mockRow.getCell as jest.Mock).mockImplementation((idx) => ({
        value: idx === 6 ? 100 : new Date(),
      }));

      const errors = component.validateRow(mockRow);
      expect(errors.length).toBe(0);
    });

    it('should reject zero amount', () => {
      (mockRow.getCell as jest.Mock).mockImplementation((idx) => ({
        value: idx === 6 ? 0 : new Date(),
      }));

      const errors = component.validateRow(mockRow);
      expect(
        errors.some((e) => e.description.includes('no es un monto válido')),
      ).toBe(true);
    });

    it('should reject negative amount', () => {
      (mockRow.getCell as jest.Mock).mockImplementation((idx) => ({
        value: idx === 6 ? -100 : new Date(),
      }));

      const errors = component.validateRow(mockRow);
      expect(
        errors.some((e) => e.description.includes('no es un monto válido')),
      ).toBe(true);
    });

    it('should validate required fields', () => {
      const mockRowWithMissingFields = createMockRow({
        getCell: jest.fn().mockReturnValue({ value: null }),
        actualCellCount: 5,
      });

      const errors = component.validateRow(mockRowWithMissingFields);
      expect(
        errors.some((e) => e.description.includes('debe tener un valor')),
      ).toBe(true);
    });
  });

  describe('status handling', () => {
    let component: TestDialogComponent;
    let excelService: jest.Mocked<
      ExcelService & { StatusExcel: () => Subject<any> }
    >;
    let trackingService: TrackingService;
    let statusSubject: Subject<ProcessStatus>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDialogComponent);
      component = fixture.componentInstance;
      excelService = TestBed.inject(ExcelService) as jest.Mocked<
        ExcelService & { StatusExcel: () => Subject<any> }
      >;
      trackingService = TestBed.inject(TrackingService);
      statusSubject = new Subject<ProcessStatus>();
      fixture.detectChanges();
    });

    it('should identify processing status correctly', () => {
      expect(
        component.callIsProcessing({ status: 'VALIDATING' } as ProcessStatus),
      ).toBe(true);
      expect(
        component.callIsProcessing({ status: 'SAVING' } as ProcessStatus),
      ).toBe(true);
      expect(
        component.callIsProcessing({
          status: processStatus.rejected,
        } as ProcessStatus),
      ).toBe(false);
      expect(
        component.callIsProcessing({
          status: processStatus.completed,
        } as ProcessStatus),
      ).toBe(false);
      expect(
        component.callIsProcessing({
          status: processStatus.failed,
        } as ProcessStatus),
      ).toBe(false);
      expect(
        component.callIsProcessing({
          status: processStatus.confirmUser,
        } as ProcessStatus),
      ).toBe(false);
    });

    it('should handle in-progress status correctly', () => {
      const mockInProgressStatus: ProcessStatus = {
        status: 'VALIDATING' as StatusValues,
        advance: 50,
        phase: 2,
        rowsUploaded: 0,
        rowsRejected: 0,
        errors: [],
      };

      component.callHandleInProgressStatus(mockInProgressStatus);
      expect(component.progress.mode).toBe('determinate');
      expect(component.progress.value).toBe(50);
      expect(component.progress.status).toBe('Validando (2/3)');

      const mockSavingStatus: ProcessStatus = {
        ...mockInProgressStatus,
        status: 'SAVING' as StatusValues,
        phase: 1,
      };

      component.callHandleInProgressStatus(mockSavingStatus);
      expect(component.progress.status).toBe('Grabando (1/2)');
    });

    // describe('verifyStatus', () => {
    //   beforeEach(() => {
    //     component.ready = true;
    //   });
    //
    //   it('should handle rejected status', () => {
    //     const mockStatus: ProcessStatus = {
    //       status: processStatus.rejected,
    //       rowsUploaded: 5,
    //       rowsRejected: 3,
    //       errors: [{ description: 'test error', row: 1 }],
    //       advance: 100,
    //       phase: 3,
    //     };
    //
    //     excelService.StatusExcel = jest.fn(
    //       () => statusSubject.asObservable(),
    //     );
    //     component.callVerifyStatus();
    //     statusSubject.next(mockStatus);
    //     expect(excelService.resetProcessState).toHaveBeenCalled();
    //     expect(component.rowsAccepted).toBe(5);
    //     expect(component.rowsRejected).toBe(3);
    //     expect(excelService.errores).toEqual(mockStatus.errors);
    //     expect(component.cuadro_errores).toBe(true);
    //
    //     component.callHandleStatus(mockStatus, {
    //       category: 'Test',
    //       action: 'Test',
    //     });
    //   });
    //
    //   it('should handle confirmUser status', () => {
    //     const mockStatus: ProcessStatus = {
    //       status: processStatus.confirmUser,
    //       rowsUploaded: 10,
    //       rowsRejected: 2,
    //       errors: [],
    //       advance: 100,
    //       phase: 3,
    //     };
    //
    //     excelService.StatusExcel = jest.fn().mockReturnValue(statusSubject);
    //     component.callVerifyStatus();
    //     statusSubject.next(mockStatus);
    //
    //     expect(component.confirmUser).toBe(true);
    //     expect(component.rowsAccepted).toBe(10);
    //     expect(component.rowsRejected).toBe(2);
    //
    //     component.callHandleStatus(mockStatus, {
    //       category: 'Test',
    //       action: 'Test',
    //     });
    //   });
    //
    //   it('should not process status when ready is false', () => {
    //     component.ready = false;
    //     const mockStatus: ProcessStatus = {
    //       status: processStatus.rejected,
    //       rowsUploaded: 5,
    //       rowsRejected: 3,
    //       errors: [{ description: 'test error', row: 1 }],
    //       advance: 100,
    //       phase: 3,
    //     };
    //
    //     excelService.StatusExcel = jest.fn().mockReturnValue(statusSubject);
    //     component.callVerifyStatus();
    //     statusSubject.next(mockStatus);
    //
    //     expect(excelService.statusUpload).not.toBe(false);
    //     expect(component.rowsAccepted).toBe(0);
    //     expect(component.rowsRejected).toBe(0);
    //
    //     component.callHandleStatus(mockStatus, {
    //       category: 'Test',
    //       action: 'Test',
    //     });
    //   });
    // });

    describe('verifyStatus v2', () => {
      it('should set ready to true and initialize progress', () => {
        component.callVerifyStatus();

        expect(component.ready).toBe(true);
        expect(component.progress.mode).toBe('determinate');
        expect(component.progress.value).toBe(0);
        expect(component.progress.status).toBe('Validando (0/3)');
      });

      // it('should process status updates until terminal status is reached', () => {
      //   (component as any).isProcessing = jest.fn();
      //   (component as any).isProcessing
      //     .mockReturnValueOnce(true) // First call (processing)
      //     .mockReturnValueOnce(false); // Second call (stop)
      //
      //   (component as any).verifyStatus();
      //
      //   statusSubject.next({
      //     advance: 0,
      //     errors: [],
      //     phase: 0,
      //     rowsRejected: 0,
      //     rowsUploaded: 0,
      //     status: processStatus.validating,
      //   });
      //   statusSubject.next({
      //     status: processStatus.completed,
      //     errors: [],
      //     rowsUploaded: 0,
      //     rowsRejected: 0,
      //     advance: 0,
      //     phase: 0,
      //   });
      //   statusSubject.complete();
      //
      //   expect((component as any).handleStatus).toHaveBeenCalledWith(
      //     { status: processStatus.validating },
      //     expect.any(Object),
      //   );
      //   expect((component as any).handleStatus).toHaveBeenCalledWith(
      //     { status: processStatus.completed },
      //     expect.any(Object),
      //   );
      // });
    });

    describe('file handling', () => {
      it('should clear files and errors on removeFiled', () => {
        component.uploaderFiles = [new File([''], 'test.xlsx')];
        excelService.errores = [{ description: 'test error', row: 1 }];
        component.confirmUser = true;

        component.removeFiled();

        expect(component.uploaderFiles).toEqual([]);
        expect(excelService.errores).toEqual([]);
        expect(component.confirmUser).toBe(false);
      });

      it('should update files on selectFiled', () => {
        const testFiles = [
          new File([''], 'test1.xlsx'),
          new File([''], 'test2.xlsx'),
        ];
        component.selectFiled({ currentFiles: testFiles });
        expect(component.uploaderFiles).toEqual(testFiles);
      });
    });

    describe('openSnackBar', () => {
      it('should show messageUploadExcel when isProcessActive() is true', async () => {
        isProcessActiveSignal.set(true);
        await component.openSnackBar();
        expect(component.messageUploadExcel).toBe(true);
      });

      it('should handle validation errors', async () => {
        const validationError = [{ description: 'test error', row: 1 }];
        jest
          .spyOn(component, 'validateFile')
          .mockResolvedValue(validationError);

        await component.openSnackBar();
        expect(excelService.errores).toEqual(validationError);
      });

      it('should handle file upload with confirmUser', async () => {
        component.confirmUser = true;
        const mockSubscribe = jest.fn();
        excelService.confirmUser = jest
          .fn()
          .mockReturnValue({ subscribe: mockSubscribe });

        await component.openSnackBar();

        expect(excelService.confirmUser).toHaveBeenCalledWith(
          component.uploaderFiles,
        );
        expect(mockSubscribe).toHaveBeenCalled();
        expect(component.confirmUser).toBe(false);
      });

      // it('should handle file upload error', async () => {
      //   const mockError = new HttpErrorResponse({
      //     error: 'test error',
      //     status: 400,
      //     statusText: 'Bad Request',
      //   });
      //
      //   excelService.UploadExcel = jest.fn().mockReturnValue({
      //     subscribe: ({
      //       error,
      //     }: {
      //       error: (err: HttpErrorResponse) => void;
      //     }) => {
      //       error(mockError);
      //     },
      //   });
      //
      //   await component.openSnackBar();
      //
      //   expect(excelService.isProcessActive()).toBe(false);
      //   expect(excelService.errores).toEqual([
      //     {
      //       description: 'El nombre del archivo no es correcto',
      //       row: 0,
      //     },
      //   ]);
      // });
    });

    // describe('tracking events', () => {
    //   it('should track form submit event on upload error', async () => {
    //     const mockError = new HttpErrorResponse({
    //       error: 'test error',
    //       status: 400,
    //       statusText: 'Bad Request',
    //     });
    //
    //     excelService.UploadExcel = jest.fn().mockReturnValue({
    //       subscribe: ({
    //         error,
    //       }: {
    //         error: (err: HttpErrorResponse) => void;
    //       }) => {
    //         error(mockError);
    //       },
    //     });
    //
    //     const trackEventSpy = jest.spyOn(
    //       TestBed.inject(TrackingService),
    //       'trackEvent',
    //     );
    //     await component.openSnackBar();
    //
    //     expect(trackEventSpy).toHaveBeenCalledWith(
    //       AdobeEvent.trackFormSubmit,
    //       expect.objectContaining({
    //         state: 'Intento de envio',
    //         typeError: 'El nombre del archivo no es correcto',
    //       }),
    //     );
    //   });
    // });
  });
});
