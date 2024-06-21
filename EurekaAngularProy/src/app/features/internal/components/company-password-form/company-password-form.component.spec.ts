import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { PasswordModule } from 'primeng/password';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { errorRegisterAuth } from '../../../../shared/constants/company-errors';
import { CompanyService } from '../../../../shared/services';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { CompanyConfigurationService } from '../../services';
import { CompanyPasswordFormComponent } from './company-password-form.component';

describe('CompanyPasswordFormComponent', () => {
  let component: CompanyPasswordFormComponent;
  let fixture: ComponentFixture<CompanyPasswordFormComponent>;
  let service: CompanyConfigurationService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [CompanyPasswordFormComponent, LabelControlComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        HttpClientTestingModule,
      ],
      providers: [
        CompanyService,
        CompanyConfigurationService,
        MockProvider(LoginService),
        NotifyService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(CompanyConfigurationService);
    fixture = TestBed.createComponent(CompanyPasswordFormComponent);
    component = fixture.componentInstance;
    component.form = service.passwordForm;
    component.errorMessages = {
      ...errorRegisterAuth,
      newPassword: errorRegisterAuth.newPassword,
      confirmNewPassword: errorRegisterAuth.passwordConfirm,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
