import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ExcelService } from '../../../../../../shared/services/excel.service';
import { DialogHeaderComponent } from './dialog-header.component';

describe('DialogHeaderComponent', () => {
  let component: DialogHeaderComponent;
  let fixture: ComponentFixture<DialogHeaderComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: jest.fn() } },
        ExcelService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogHeaderComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close on DynamicDialogRef', () => {
    component.hide();
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });

  it('should not throw any errors', () => {
    expect(() => component.hide()).not.toThrow();
  });
});
