import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { ValdemortModule } from 'ngx-valdemort';
import { DropdownModule } from 'primeng/dropdown';
import { KeyFilterModule } from 'primeng/keyfilter';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
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
      declarations: [CompanyUpdateFormComponent, LabelControlComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ValdemortModule,
        DropdownModule,
        KeyFilterModule,
      ],
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
