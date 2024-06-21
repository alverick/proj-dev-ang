import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';
import { ValdemortModule } from 'ngx-valdemort';
import { DropdownModule } from 'primeng/dropdown';
import { KeyFilterModule } from 'primeng/keyfilter';

import { environment } from '../../../../../environments/environment';
import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { errorsRegisterForm } from '../../../../shared/constants/company-errors';
import { IpInfoDataService } from '../../../../shared/data';
import {
  CompanyService,
  DigitalDataService,
  EnterpriseHeadingService,
  ServicesFormsService,
} from '../../../../shared/services';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { AffiliationFormsService, AffiliationService } from '../../services';
import { CompanyFormRegistrationComponent } from './company-form-registration.component';

describe('CompanyFormRegistrationComponent', () => {
  let component: CompanyFormRegistrationComponent;
  let fixture: ComponentFixture<CompanyFormRegistrationComponent>;
  let service: AffiliationService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [CompanyFormRegistrationComponent, LabelControlComponent],
      imports: [
        DropdownModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        ValdemortModule,
        LoggerModule.forRoot({
          level: environment.logLevel,
          serverLogLevel: environment.serverLogLevel,
          disableConsoleLogging: false,
          enableSourceMaps: true,
        }),
        KeyFilterModule,
      ],
      providers: [
        AffiliationFormsService,
        AffiliationService,
        MockProvider(LoginService),
        CompanyService,
        MockProvider(DigitalDataService),
        EnterpriseHeadingService,
        IpInfoDataService,
        NotifyService,
        ServicesFormsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(AffiliationService);
    fixture = TestBed.createComponent(CompanyFormRegistrationComponent);
    component = fixture.componentInstance;
    component.registerForm = service.registerForm;
    component.errorMessages = errorsRegisterForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
