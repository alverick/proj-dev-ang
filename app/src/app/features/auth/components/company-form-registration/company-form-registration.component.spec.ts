import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { type ModelFormGroup } from '../../../../shared/models/forms';
import { errorsRegisterForm } from '../../constants';
import { type RegisterForm } from '../../services/affiliation-forms.service';
import { CompanyFormRegistrationComponent } from './company-form-registration.component';

describe('CompanyFormRegistrationComponent', () => {
  let component: CompanyFormRegistrationComponent;
  let fixture: ComponentFixture<CompanyFormRegistrationComponent>;
  let formBuilder: FormBuilder;
  let mockRegisterForm: ModelFormGroup<RegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CompanyFormRegistrationComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyFormRegistrationComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    mockRegisterForm = formBuilder.group({
      documentType: ['DNI'],
      documentNumber: [''],
      ruc: [''],
      email: [''],
      emailConfirm: [''],
      movilNumber: [''],
      movilOperator: [''],
    });

    fixture.componentRef.setInput('registerForm', mockRegisterForm);
    fixture.componentRef.setInput('errorMessages', errorsRegisterForm);
    fixture.componentRef.setInput('operators', []);
    fixture.componentRef.setInput('documentTypes', []);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set document number properties on init', () => {
    const setDocumentNumberPropsSpy = jest.spyOn(
      component,
      'setDocumentNumberProps',
    );
    component.ngOnInit();
    expect(setDocumentNumberPropsSpy).toHaveBeenCalled();
  });

  it('should update document number validators on document type change', () => {
    const setDocumentNumberPropsSpy = jest.spyOn(
      component,
      'setDocumentNumberProps',
    );
    mockRegisterForm.get('documentType').setValue('CE');
    expect(setDocumentNumberPropsSpy).toHaveBeenCalled();
  });

  it('should emit form value on submit when form is valid', () => {
    const sendFormSpy = jest.spyOn(component.sendForm, 'emit');

    mockRegisterForm.patchValue({
      ruc: '12345678901',
      email: 'test@example.com',
      emailConfirm: 'test@example.com',
      documentType: 'DNI',
      documentNumber: '12345678',
      movilOperator: 'CLARO',
      movilNumber: '987654321',
    });

    component.onSubmit();
    expect(sendFormSpy).toHaveBeenCalled();
  });

  it('should not emit form value on submit when form is invalid', () => {
    const sendFormSpy = jest.spyOn(component.sendForm, 'emit');

    component.onSubmit();
    expect(sendFormSpy).not.toHaveBeenCalled();
  });
});
