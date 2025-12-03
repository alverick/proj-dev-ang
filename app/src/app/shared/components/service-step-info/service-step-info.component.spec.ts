import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { errorServiceConfiguration } from '../../../features/auth/constants';
import { ServicesFormsService } from '../../services';
import { ServiceStepInfoComponent } from './service-step-info.component';

describe('ServiceStepInfoComponent', () => {
  let component: ServiceStepInfoComponent;
  let fixture: ComponentFixture<ServiceStepInfoComponent>;
  let service: ServicesFormsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ServiceStepInfoComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [ServicesFormsService, FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceStepInfoComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ServicesFormsService);

    fixture.componentRef.setInput('form', service.serviceForm);
    fixture.componentRef.setInput('errorMessages', errorServiceConfiguration);
    fixture.componentRef.setInput('accounts', []);
    fixture.componentRef.setInput('showCancel', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set disclaimerCommissionDollars to true when account currency is not soles', () => {
    const accounts = [{ id: '1', number: '1234567890123', currency: 'USD' }];
    fixture.componentRef.setInput('accounts', accounts);
    fixture.detectChanges();
    component.form().get('account').setValue('1');
    expect(component.disclaimerCommissionDollars).toBe(true);
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

  it('should emit cancel on cancel', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
