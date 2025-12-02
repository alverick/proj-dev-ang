import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { errorServiceConfiguration } from '../../../features/auth/constants';
import { ServicesFormsService } from '../../services';
import { ServiceDebtFormComponent } from './service-debt-form.component';

describe('ServiceDebtFormComponent', () => {
  let component: ServiceDebtFormComponent;
  let fixture: ComponentFixture<ServiceDebtFormComponent>;
  let service: ServicesFormsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ServiceDebtFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [ServicesFormsService, FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDebtFormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ServicesFormsService);

    fixture.componentRef.setInput('form', service.editServiceForm.get('debt'));
    fixture.componentRef.setInput('errorMessages', errorServiceConfiguration);
    fixture.componentRef.setInput('paymentTypeOptions', []);
    fixture.componentRef.setInput('currencyOptions', []);
    fixture.componentRef.setInput('chargeTypeOptions', []);
    fixture.componentRef.setInput('interestTypeOptions', []);
    fixture.componentRef.setInput('submitted', false);
    fixture.componentRef.setInput('interestOnlyInfo', false);
    fixture.componentRef.setInput('currency', 'S/');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show arrears fields when chargeInterest is "S"', () => {
    component.form().get('chargeInterest').setValue('S');
    expect(component.showArrearsFields).toBe(true);
  });

  it('should hide arrears fields when chargeInterest is "N"', () => {
    component.form().get('chargeInterest').setValue('N');
    expect(component.showArrearsFields).toBe(false);
  });

  it('should set amount props based on interestType', () => {
    component.form().get('interestType').setValue('M');
    expect(component.unitAmount).toBe('S/');
    expect(component.maxAmount).toBe(1000);
    expect(component.minAmount).toBe(0.5);

    component.form().get('interestType').setValue('P');
    expect(component.unitAmount).toBe('% ');
    expect(component.maxAmount).toBe(100);
    expect(component.minAmount).toBe(0.01);
  });
});
