import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MockProvider, MockProviders } from 'ng-mocks';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { of } from 'rxjs';

import { MessageAlertComponent } from '../../../../../../shared/components/message-alert/message-alert.component';
import { ServiceTypes } from '../../../../../../shared/constants/services';
import { ExcelService } from '../../../../../../shared/services/excel.service';
import { StorageService } from '../../../../../../shared/services/storage.service';
import { TrackingService } from '../../../../../../shared/services/tracking.service';
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

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let excelService: jest.Mocked<ExcelService>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogComponent,
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
          statusUpload: false,
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

    fixture = TestBed.createComponent(DialogComponent);
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
    excelService.statusUpload = false;
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
      // Override the workbook mock for this test
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

      // Mock FileReader
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
  });
});
