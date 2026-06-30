import {
  type ComponentRef,
  InjectionToken,
  signal,
  type ViewContainerRef,
  type WritableSignal,
} from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { internalFullRoutingNames } from '../../app-routing.collection';
import { type LoadFileComponent } from '../components/load-file/load-file.component';
import { processStatus } from '../constants/process';
import {
  ExcelService,
  type LastProcessStatus,
  type ProcessStatus,
} from './excel.service';
import { LoadFileService, type ModalCloseData } from './load-file.service';

const MOCK_VCR_TOKEN = new InjectionToken<ViewContainerRef>(
  'Mock ViewContainerRef',
);
const mockViewContainerRef = {
  clear: jest.fn(),
  createComponent: jest.fn(),
};

const mockLoadFileInstance = {
  progress: {
    mode: '',
    value: 0,
    status: '',
  },
};

const mockComponentRef = {
  instance: mockLoadFileInstance,
  destroy: jest.fn(),
};

const processStatusMock: ProcessStatus = {
  errors: [],
  rowsRejected: 0,
  rowsUploaded: 0,
  advance: 0,
  phase: 0,
  status: processStatus.completed,
};

const lastProcessStatusMock: LastProcessStatus = {
  id: 2,
  advance: 0,
  phase: 0,
  status: processStatus.completed,
};

describe('LoadFileService', () => {
  let service: LoadFileService;
  let excelServiceMock: ExcelService;
  let viewContainerRefMock: jest.Mocked<ViewContainerRef>;

  beforeEach(() => {
    mockViewContainerRef.clear.mockClear();
    mockViewContainerRef.createComponent.mockClear();
    mockComponentRef.destroy.mockClear();
    mockLoadFileInstance.progress = { mode: '', value: 0, status: '' };

    TestBed.configureTestingModule({
      providers: [
        LoadFileService,
        MockProvider(ExcelService, {
          isProcessActive: signal(false),
          idProcess: 123,
          errores: [],
          GetLastProcess: jest.fn(() => {
            return of(lastProcessStatusMock);
          }),
          StatusExcel: jest.fn(() =>
            of({ ...processStatusMock, status: processStatus.validating }),
          ),
          startUpload: jest.fn(),
          resetProcessState: jest.fn(),
        }),
        MockProvider(Router, {
          url: internalFullRoutingNames.HOME,
        }),
        {
          provide: MOCK_VCR_TOKEN,
          useValue: mockViewContainerRef,
        },
      ],
    });

    service = TestBed.inject(LoadFileService);
    excelServiceMock = TestBed.inject(ExcelService);

    const injectedVcr = TestBed.inject(MOCK_VCR_TOKEN);
    viewContainerRefMock = injectedVcr as jest.Mocked<ViewContainerRef>;

    viewContainerRefMock.createComponent.mockReturnValue(
      mockComponentRef as unknown as ComponentRef<LoadFileComponent>,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isRunning', () => {
    it('should return false initially', () => {
      expect(service.isRunning()).toBe(false);
    });

    it('should return true after component is created via verify', () => {
      (excelServiceMock.isProcessActive as WritableSignal<boolean>).set(true);
      service.verify(viewContainerRefMock);
      expect(service.isRunning()).toBe(true);
    });

    it('should return false after close is called', () => {
      (excelServiceMock.isProcessActive as WritableSignal<boolean>).set(true);
      service.verify(viewContainerRefMock);
      expect(service.isRunning()).toBe(true);

      service.close();

      expect(service.isRunning()).toBe(false);
    });
  });

  describe('close', () => {
    it('should destroy componentRef, set it to null, and set cancel flag if running', () => {
      (excelServiceMock.isProcessActive as WritableSignal<boolean>).set(true);
      service.verify(viewContainerRefMock);
      expect(service.isRunning()).toBe(true);
      (service as any).cancel = false;

      service.close();

      expect((service as any).cancel).toBe(true);
      expect(mockComponentRef.destroy).toHaveBeenCalledTimes(1);
      expect((service as any).componentRef).toBeNull();
      expect(service.isRunning()).toBe(false);
    });

    it('should do nothing if componentRef is already null', () => {
      expect(service.isRunning()).toBe(false);
      const initialCancel = (service as any).cancel;

      service.close();

      expect((service as any).cancel).toBe(initialCancel);
      expect(mockComponentRef.destroy).not.toHaveBeenCalled();
      expect((service as any).componentRef).toBeNull();
    });
  });

  describe('verify', () => {
    it('should clear the container', () => {
      service.verify(viewContainerRefMock);
      expect(viewContainerRefMock.clear).toHaveBeenCalledTimes(1);
    });

    it('should create component and call verifyStatus if excelService.isProcessActive() is true', () => {
      (excelServiceMock.isProcessActive as WritableSignal<boolean>).set(true);
      const verifyStatusSpy = jest.spyOn(service as any, 'verifyStatus');

      service.verify(viewContainerRefMock);

      expect(viewContainerRefMock.createComponent).toHaveBeenCalledTimes(1);
      expect(verifyStatusSpy).toHaveBeenCalledTimes(1);
      expect(service.isRunning()).toBe(true);

      verifyStatusSpy.mockRestore();
    });

    it('should call GetLastProcess if excelService.isProcessActive() is false', fakeAsync(() => {
      (excelServiceMock.isProcessActive as WritableSignal<boolean>).set(false);
      jest
        .mocked(excelServiceMock.GetLastProcess)
        .mockReturnValue(
          of({ ...lastProcessStatusMock, status: processStatus.completed }),
        );

      service.verify(viewContainerRefMock);
      tick();

      expect(excelServiceMock.GetLastProcess).toHaveBeenCalledTimes(1);
    }));

    it('should create component and call verifyStatus if isProcessActive() is false and GetLastProcess returns a running status', fakeAsync(() => {
      const runningStatus = { ...lastProcessStatusMock, status: processStatus.validating, id: 456 };
      (excelServiceMock.isProcessActive as WritableSignal<boolean>).set(false);
      jest
        .mocked(excelServiceMock.GetLastProcess)
        .mockReturnValue(
          of(runningStatus),
        );
      const verifyStatusSpy = jest.spyOn(service as any, 'verifyStatus');

      service.verify(viewContainerRefMock);
      tick();

      tick(0);

      expect(excelServiceMock.GetLastProcess).toHaveBeenCalledTimes(1);
      expect(excelServiceMock.startUpload).toHaveBeenCalledWith(runningStatus.id);
      expect(viewContainerRefMock.createComponent).toHaveBeenCalledTimes(1);
      expect(verifyStatusSpy).toHaveBeenCalledTimes(1);
      expect(service.isRunning()).toBe(true);

      service.close();
      tick(3000);

      verifyStatusSpy.mockRestore();
    }));

    it('should NOT create component if isProcessActive() is false and GetLastProcess returns a final status', fakeAsync(() => {
      (excelServiceMock.isProcessActive as WritableSignal<boolean>).set(false);
      jest
        .mocked(excelServiceMock.GetLastProcess)
        .mockReturnValue(
          of({ ...lastProcessStatusMock, status: processStatus.completed }),
        );
      const verifyStatusSpy = jest.spyOn(service as any, 'verifyStatus');

      service.verify(viewContainerRefMock);
      tick();

      expect(excelServiceMock.GetLastProcess).toHaveBeenCalledTimes(1);
      expect(excelServiceMock.startUpload).not.toHaveBeenCalled();
      expect(viewContainerRefMock.createComponent).not.toHaveBeenCalled();
      expect(verifyStatusSpy).not.toHaveBeenCalled();
      expect(service.isRunning()).toBe(false);

      verifyStatusSpy.mockRestore();
    }));

    it('should handle error from GetLastProcess gracefully', fakeAsync(() => {
      (excelServiceMock.isProcessActive as WritableSignal<boolean>).set(false);
      const error = new Error('Failed to get last process');
      jest
        .mocked(excelServiceMock.GetLastProcess)
        .mockReturnValue(throwError(() => error));
      const verifyStatusSpy = jest.spyOn(service as any, 'verifyStatus');

      expect(() => {
        service.verify(viewContainerRefMock);
        tick();
      }).not.toThrow();

      expect(excelServiceMock.GetLastProcess).toHaveBeenCalledTimes(1);
      expect(viewContainerRefMock.createComponent).not.toHaveBeenCalled();
      expect(verifyStatusSpy).not.toHaveBeenCalled();
      expect(service.isRunning()).toBe(false);

      verifyStatusSpy.mockRestore();
    }));
  });

  describe('verifyStatus polling', () => {
    const delay = 2000;

    beforeEach(() => {
      (excelServiceMock.isProcessActive as WritableSignal<boolean>).set(true);

      jest.spyOn(service.onClose, 'emit');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should initialize progress and start polling StatusExcel', fakeAsync(() => {
      jest.mocked(excelServiceMock.StatusExcel).mockReturnValue(
        of({
          ...processStatusMock,
          status: processStatus.validating,
          advance: 0,
          phase: 0,
        }),
      );

      service.verify(viewContainerRefMock);

      expect(mockLoadFileInstance.progress.mode).toBe('determinate');
      expect(mockLoadFileInstance.progress.value).toBe(0);
      expect(mockLoadFileInstance.progress.status).toBe('Validando (0/3)');

      tick(0);

      expect(excelServiceMock.StatusExcel).toHaveBeenCalledTimes(1);
      expect(excelServiceMock.StatusExcel).toHaveBeenCalledWith(
        excelServiceMock.idProcess,
      );

      service.close();
      tick(delay * 5);
    }));

    it('should update progress for VALIDATING status', fakeAsync(() => {
      jest.mocked(excelServiceMock.StatusExcel).mockReturnValueOnce(
        of({
          status: processStatus.validating,
          advance: 30,
          phase: 1,
        } as ProcessStatus),
      );

      service.verify(viewContainerRefMock);
      tick(delay * 2);

      expect(mockLoadFileInstance.progress.mode).toBe('determinate');
      expect(mockLoadFileInstance.progress.value).toBe(30);
      expect(mockLoadFileInstance.progress.status).toBe('Validando (1/3)');

      service.close();
      tick(delay * 5);
    }));

    it('should update progress for SAVING status', fakeAsync(() => {
      jest.mocked(excelServiceMock.StatusExcel).mockReturnValueOnce(
        of({
          status: processStatus.saving,
          advance: 75,
          phase: 2,
        } as ProcessStatus),
      );

      service.verify(viewContainerRefMock);
      tick(delay * 2);

      expect(mockLoadFileInstance.progress.mode).toBe('determinate');
      expect(mockLoadFileInstance.progress.value).toBe(75);
      expect(mockLoadFileInstance.progress.status).toBe('Grabando (2/2)');

      service.close();
      tick(delay * 5);
    }));

    it('should stop polling on FAILED status and call resetProcessState', fakeAsync(() => {
      const finalStatus: ProcessStatus = {
        status: processStatus.failed,
        advance: 50,
        rowsUploaded: 0,
        rowsRejected: 0,
        errors: [],
        phase: 1,
      };
      const expectedEmit: Partial<ModalCloseData> = {
        status: processStatus.failed,
        rowsAccepted: 0,
        rowsRejected: 0,
      };
      jest
        .mocked(excelServiceMock.StatusExcel)
        .mockReturnValueOnce(of(finalStatus));

      service.verify(viewContainerRefMock);
      tick(0);

      expect(mockComponentRef.destroy).toHaveBeenCalledTimes(1);
      expect(service.onClose.emit).toHaveBeenCalledWith(expectedEmit);
      expect(excelServiceMock.resetProcessState).toHaveBeenCalledTimes(1);

      tick(delay);
      expect(excelServiceMock.StatusExcel).toHaveBeenCalledTimes(1);
      tick(delay * 5);
    }));

    it('should stop polling if close() is called (cancel flag set)', fakeAsync(() => {
      jest
        .mocked(excelServiceMock.StatusExcel)
        .mockReturnValueOnce(
          of({
            status: processStatus.validating,
            advance: 20,
            phase: 1,
          } as ProcessStatus),
        )
        .mockReturnValueOnce(
          of({
            status: processStatus.saving,
            advance: 60,
            phase: 1,
          } as ProcessStatus),
        );

      service.verify(viewContainerRefMock);

      tick(0);
      expect(excelServiceMock.StatusExcel).toHaveBeenCalledTimes(1);

      service.close();

      tick(delay);
      expect(excelServiceMock.StatusExcel).toHaveBeenCalledTimes(1);
      expect(service.onClose.emit).not.toHaveBeenCalled();

      tick(delay * 5);
    }));
  });
});
