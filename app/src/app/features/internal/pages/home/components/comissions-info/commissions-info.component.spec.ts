import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TrackingService } from '../../../../../../shared/services';
import { CommissionsInfoComponent } from './commissions-info.component';

describe('CommissionsInfoComponent', () => {
  let component: CommissionsInfoComponent;
  let fixture: ComponentFixture<CommissionsInfoComponent>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommissionsInfoComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: jest.fn() } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: Router, useValue: {} },
        { provide: TrackingService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommissionsInfoComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    config = TestBed.inject(DynamicDialogConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showed to false when config.data.showed is not present', () => {
    config.data = {};
    fixture.detectChanges();
    expect(component.showed).toBe(false);
  });

  it('should set showed to the value of config.data.showed when it is present', () => {
    config.data = { showed: true };

    fixture = TestBed.createComponent(CommissionsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.showed).toBe(true);
  });

  it('should set showed to false when config.data.showed is null or undefined', () => {
    config.data = { showed: null };
    fixture = TestBed.createComponent(CommissionsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.showed).toBe(false);

    config.data = { showed: undefined };
    fixture = TestBed.createComponent(CommissionsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.showed).toBe(false);
  });

  it('should call dialogRef.close with provided action', () => {
    const action = 'test-action';
    component.close(action);
    expect(dialogRef.close).toHaveBeenCalledWith(action);
  });

  it('should call dialogRef.close with empty string when no action is provided', () => {
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });
});
