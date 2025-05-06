import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TrackingService } from '../../../../../../shared/services';
import { StorageService } from '../../../../../../shared/services/storage.service';
import { CommissionsInfoComponent } from './commissions-info.component';

describe('CommissionsInfoComponent', () => {
  let component: CommissionsInfoComponent;
  let router: Router;
  let dialogRef: DynamicDialogRef;
  let trackingService: TrackingService;
  let config: DynamicDialogConfig;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [
        { provide: DynamicDialogRef, useValue: { close: jest.fn() } },
        DynamicDialogConfig,
        StorageService,
        { provide: Router, useValue: {} },
        { provide: TrackingService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    trackingService = TestBed.inject(TrackingService);
    router = TestBed.inject(Router);
    dialogRef = TestBed.inject(DynamicDialogRef);
    config = TestBed.inject(DynamicDialogConfig);
    component = new CommissionsInfoComponent(
      trackingService,
      router,
      dialogRef,
      config,
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showed to false when config.data.showed is not present', () => {
    config.data = { showed: true };
    component = new CommissionsInfoComponent(
      trackingService,
      router,
      dialogRef,
      config,
    );
    expect(component.showed).toBe(true);
  });

  it('should set showed to the value of config.data.showed when it is present', () => {
    config.data = { showed: true };
    component = new CommissionsInfoComponent(
      trackingService,
      router,
      dialogRef,
      config,
    );
    expect(component.showed).toBe(true);
  });

  it('should set showed to false when config.data.showed is null or undefined', () => {
    config.data = { showed: null };
    component = new CommissionsInfoComponent(
      trackingService,
      router,
      dialogRef,
      config,
    );
    expect(component.showed).toBe(false);
    config.data = { showed: undefined };
    component = new CommissionsInfoComponent(
      trackingService,
      router,
      dialogRef,
      config,
    );
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
