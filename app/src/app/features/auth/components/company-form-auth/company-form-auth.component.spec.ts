import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { type IEntryModel } from '../../../../shared/models';
import { type SimpleModelFormGroup } from '../../../../shared/models/forms';
import { TrackingService } from '../../../../shared/services';
import { StorageService } from '../../../../shared/services/storage.service';
import { errorRegisterAuth } from '../../constants';
import { type AuthForm } from '../../services/affiliation-forms.service';
import { CompanyFormAuthComponent } from './company-form-auth.component';

describe('CompanyFormAuthComponent', () => {
  let component: CompanyFormAuthComponent;
  let fixture: ComponentFixture<CompanyFormAuthComponent>;
  let mockAuthForm: SimpleModelFormGroup<AuthForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CompanyFormAuthComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: DynamicDialogRef,
          useValue: { open: jest.fn(), close: jest.fn() },
        },
        { provide: TrackingService, useValue: { trackEvent: jest.fn() } },
        { provide: StorageService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyFormAuthComponent);
    component = fixture.componentInstance;
    const formBuilder = TestBed.inject(FormBuilder);

    mockAuthForm = formBuilder.group({
      nameSelect: ['', Validators.required],
      entrySelect: [null as IEntryModel, Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      entry: [''],
      name: [''],
      ruc: [''],
    });

    fixture.componentRef.setInput('companyForm', mockAuthForm);
    fixture.componentRef.setInput('errorMessages', errorRegisterAuth);
    fixture.componentRef.setInput('categories', []);
    fixture.componentRef.setInput('nameOptions', []);
    fixture.componentRef.setInput('passwordNoEditable', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set category on init if entry value exists', () => {
    const setCategorySelectedSpy = jest.spyOn(component, 'setCategorySelected');
    mockAuthForm.get('entry').setValue('some-value');
    fixture.componentRef.setInput('categories', [
      { code: 'some-value', name: 'Test' },
    ]);
    component.ngOnChanges({
      categories: {
        currentValue: [{ code: 'some-value', name: 'Test' }],
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(setCategorySelectedSpy).toHaveBeenCalled();
  });

  it('should enable/disable password fields based on passwordNoEditable input', () => {
    fixture.componentRef.setInput('passwordNoEditable', true);
    component.ngOnChanges({
      passwordNoEditable: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();
    expect(component.companyForm().get('password').disabled).toBe(true);

    fixture.componentRef.setInput('passwordNoEditable', false);
    component.ngOnChanges({
      passwordNoEditable: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();
    expect(component.companyForm().get('password').disabled).toBe(false);
  });

  it('should emit form value on submit when form is valid', () => {
    const sendFormSpy = jest.spyOn(component.sendForm, 'emit');
    mockAuthForm.patchValue({
      nameSelect: 'Test Name',
      entrySelect: { code: 'test-entry', name: 'Test Entry' },
      password: 'password123',
      passwordConfirm: 'password123',
      acceptTerms: true,
    });
    component.onSubmit();
    expect(sendFormSpy).toHaveBeenCalled();
  });

  it('should not emit form value on submit when form is invalid', () => {
    const sendFormSpy = jest.spyOn(component.sendForm, 'emit');
    mockAuthForm.patchValue({ acceptTerms: false });
    component.onSubmit();
    expect(sendFormSpy).not.toHaveBeenCalled();
  });
});
