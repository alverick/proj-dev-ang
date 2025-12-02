import { SimpleChange } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { errorServiceConfiguration } from '../../../features/auth/constants';
import { type IServiceRemoteModelForms } from '../../models';
import { ServicesFormsService } from '../../services';
import { ServiceEditFormComponent } from './service-edit-form.component';

describe('ServiceEditFormComponent', () => {
  let component: ServiceEditFormComponent;
  let fixture: ComponentFixture<ServiceEditFormComponent>;
  let service: ServicesFormsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ServiceEditFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [ServicesFormsService, FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceEditFormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ServicesFormsService);

    fixture.componentRef.setInput('form', service.editServiceForm);
    fixture.componentRef.setInput('errorMessages', errorServiceConfiguration);
    fixture.componentRef.setInput('debtorCodeOptions', []);
    fixture.componentRef.setInput('paymentTypeOptions', []);
    fixture.componentRef.setInput('currencyOptions', []);
    fixture.componentRef.setInput('chargeTypeOptions', []);
    fixture.componentRef.setInput('interestTypeOptions', []);
    fixture.componentRef.setInput('affiliationMode', true);
    fixture.componentRef.setInput('interestOnlyInfo', false);
    fixture.componentRef.setInput('formData', undefined);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show debt fields when dataType is complete', () => {
    const mockFormData: Partial<IServiceRemoteModelForms> = {
      name: 'test',
      currency: 'PEN',
      debtorCode: '123',
      idAccount: '456',
      paymentType: 'A',
      debt: {
        dataType: 'C',
        chargeInterest: 'N',
        currency: 'PEN',
        debtorCode: '123',
        idAccount: '456',
        name: 'test',
        paymentType: 'A',
      },
    };
    fixture.componentRef.setInput('formData', mockFormData);
    fixture.detectChanges();
    expect(component.showDebtFields).toBe(true);
  });

  it('should hide debt fields when dataType is not complete', () => {
    const mockFormData: Partial<IServiceRemoteModelForms> = {
      name: 'test',
      currency: 'PEN',
      debtorCode: '123',
      idAccount: '456',
      paymentType: 'A',
      debt: {
        dataType: 'P',
        chargeInterest: 'N',
        currency: 'PEN',
        debtorCode: '123',
        idAccount: '456',
        name: 'test',
        paymentType: 'A',
      },
    };
    fixture.componentRef.setInput('formData', mockFormData);
    fixture.detectChanges();
    expect(component.showDebtFields).toBe(false);
  });

  it('should emit sendForm on submit when form is valid', () => {
    const sendFormSpy = jest.spyOn(component.sendForm, 'emit');
    Object.defineProperty(component.form(), 'valid', {
      get: () => true,
    });
    component.onSubmit();
    expect(sendFormSpy).toHaveBeenCalled();
  });

  it('should not emit sendForm on submit when form is invalid', () => {
    const sendFormSpy = jest.spyOn(component.sendForm, 'emit');
    Object.defineProperty(component.form(), 'valid', {
      get: () => false,
    });
    component.onSubmit();
    expect(sendFormSpy).not.toHaveBeenCalled();
  });
});
