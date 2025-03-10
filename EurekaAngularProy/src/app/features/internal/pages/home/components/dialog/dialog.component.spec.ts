import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProviders } from 'ng-mocks';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ExcelService } from '../../../../../../shared/services/excel.service';
import { StorageService } from '../../../../../../shared/services/storage.service';
import { DialogComponent } from './dialog.component';

jest.mock('exceljs', () => ({
  Workbook: jest.fn().mockImplementation(() => ({
    addWorksheet: jest.fn(),
  })),
}));

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [
        MockProviders(ExcelService),
        DynamicDialogRef,
        DynamicDialogConfig,
        StorageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
