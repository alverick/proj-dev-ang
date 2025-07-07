import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import {
  errorRegisterAuth,
  errorsRegisterForm,
} from '../../../../shared/constants/company-errors';
import { CompanyService } from '../../../../shared/services';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { CompanyConfigurationService } from '../../services';
import { CompanyUpdateFormComponent } from './company-update-form.component';

describe('CompanyUpdateFormComponent', () => {
  let component: CompanyUpdateFormComponent;
  let fixture: ComponentFixture<CompanyUpdateFormComponent>;
  let service: CompanyConfigurationService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CompanyService,
        CompanyConfigurationService,
        MockProvider(LoginService),
        NotifyService,
        StorageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(CompanyConfigurationService);
    fixture = TestBed.createComponent(CompanyUpdateFormComponent);
    component = fixture.componentInstance;
    component.form = service.companyForm;
    component.errorMessages = { ...errorsRegisterForm, ...errorRegisterAuth };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
