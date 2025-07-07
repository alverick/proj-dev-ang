import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { errorServiceConfiguration } from '../../constants/company-errors';
import { ServicesFormsService } from '../../services';
import { ServiceStepInfoComponent } from './service-step-info.component';

describe('ServiceStepInfoComponent', () => {
  let component: ServiceStepInfoComponent;
  let fixture: ComponentFixture<ServiceStepInfoComponent>;
  let service: ServicesFormsService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
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
