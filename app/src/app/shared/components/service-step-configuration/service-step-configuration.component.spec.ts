import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { errorServiceConfiguration } from '../../../features/auth/constants';
import { ServicesFormsService } from '../../services';
import { ServiceStepConfigurationComponent } from './service-step-configuration.component';

describe('ServiceStepConfigurationComponent', () => {
  let component: ServiceStepConfigurationComponent;
  let fixture: ComponentFixture<ServiceStepConfigurationComponent>;
  let service: ServicesFormsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ServiceStepConfigurationComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [ServicesFormsService, FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceStepConfigurationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ServicesFormsService);

    fixture.componentRef.setInput('form', service.serviceConfigForm);
    fixture.componentRef.setInput('errorMessages', errorServiceConfiguration);
    fixture.componentRef.setInput('debtorCodeOptions', []);
    fixture.componentRef.setInput('paymentTypeOptions', []);
    fixture.componentRef.setInput('currencyOptions', []);
    fixture.componentRef.setInput('chargeTypeOptions', []);
    fixture.componentRef.setInput('interestTypeOptions', []);
    fixture.componentRef.setInput('showCancel', false);
    fixture.componentRef.setInput('showAllTypes', false);
    fixture.componentRef.setInput('currency', '');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show debt fields when dataType is complete', () => {
    component.form().get('dataType').setValue('C');
    expect(component.showDebtFields).toBe(true);
  });

  it('should hide debt fields when dataType is not complete', () => {
    component.form().get('dataType').setValue('P');
    expect(component.showDebtFields).toBe(true);
  });

  it('should emit sendForm on submit when form is valid', () => {
    jest.useFakeTimers();
    const sendFormSpy = jest.spyOn(component.sendForm, 'emit');
    Object.defineProperty(component.form(), 'valid', {
      get: () => true,
    });
    component.onSubmit();
    jest.runAllTimers();
    expect(sendFormSpy).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should not emit sendForm on submit when form is invalid', () => {
    jest.useFakeTimers();
    const sendFormSpy = jest.spyOn(component.sendForm, 'emit');

    Object.defineProperty(component.form(), 'valid', {
      get: () => false,
    });
    component.onSubmit();
    jest.runAllTimers();
    expect(sendFormSpy).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should emit cancel on cancel', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
