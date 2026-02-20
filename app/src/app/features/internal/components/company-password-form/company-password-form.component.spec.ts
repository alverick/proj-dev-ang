import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';

import { CompanyService } from '../../../../shared/services';
import { NotifyService } from '../../../../shared/services/notify.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { errorRegisterAuth } from '../../../auth/constants';
import { CompanyConfigurationService } from '../../services';
import { CompanyPasswordFormComponent } from './company-password-form.component';

describe('CompanyPasswordFormComponent', () => {
  let component: CompanyPasswordFormComponent;
  let fixture: ComponentFixture<CompanyPasswordFormComponent>;
  let service: CompanyConfigurationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CompanyPasswordFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        CompanyConfigurationService,
        FormBuilder,
        CompanyService,
        StorageService,
        NotifyService,
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyPasswordFormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CompanyConfigurationService);

    fixture.componentRef.setInput('form', service.passwordForm);
    fixture.componentRef.setInput('errorMessages', {
      ...errorRegisterAuth,
      newPassword: errorRegisterAuth.newPassword,
      confirmNewPassword: errorRegisterAuth.passwordConfirm,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sendForm on submit when form is valid', () => {
    const sendFormSpy = jest.spyOn(component.sendForm, 'emit');
    component.form().patchValue({
      password: 'password123',
      newPassword: 'newPassword123',
      confirmNewPassword: 'newPassword123',
    });

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
