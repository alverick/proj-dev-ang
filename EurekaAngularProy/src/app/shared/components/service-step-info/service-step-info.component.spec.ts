import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

import { errorServiceConfiguration } from '../../constants/company-errors';
import { ServicesFormsService } from '../../services';
import { LabelControlComponent } from '../label-control/label-control.component';
import { MessageAlertComponent } from '../message-alert/message-alert.component';
import { ServiceStepInfoComponent } from './service-step-info.component';

describe('ServiceStepInfoComponent', () => {
  let component: ServiceStepInfoComponent;
  let fixture: ComponentFixture<ServiceStepInfoComponent>;
  let service: ServicesFormsService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [
        ServiceStepInfoComponent,
        LabelControlComponent,
        MessageAlertComponent,
      ],
      imports: [
        CheckboxModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [ServicesFormsService],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(ServicesFormsService);
    fixture = TestBed.createComponent(ServiceStepInfoComponent);
    component = fixture.componentInstance;
    component.form = service.serviceForm;
    component.errorMessages = errorServiceConfiguration;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
