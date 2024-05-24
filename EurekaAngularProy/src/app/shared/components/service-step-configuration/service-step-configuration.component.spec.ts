import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';

import { environment } from '../../../../environments/environment';
import { CompanyServicesService } from '../../../features/internal/services';
import { errorServiceConfiguration } from '../../constants/company-errors';
import {
  CompanyService,
  DigitalDataService,
  ServicesFormsService,
} from '../../services';
import { LabelControlComponent } from '../label-control/label-control.component';
import { MessageAlertComponent } from '../message-alert/message-alert.component';
import { ServiceDebtFormComponent } from '../service-debt-form/service-debt-form.component';
import { ServiceStepConfigurationComponent } from './service-step-configuration.component';

describe('ServiceStepConfigurationComponent', () => {
  let component: ServiceStepConfigurationComponent;
  let fixture: ComponentFixture<ServiceStepConfigurationComponent>;
  let service: CompanyServicesService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [
        ServiceStepConfigurationComponent,
        LabelControlComponent,
        MessageAlertComponent,
        ServiceDebtFormComponent,
      ],
      imports: [
        DropdownModule,
        RadioButtonModule,
        HttpClientTestingModule,
        LoggerModule.forRoot({
          level: environment.logLevel,
          serverLogLevel: environment.serverLogLevel,
          disableConsoleLogging: false,
          enableSourceMaps: true,
        }),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        CompanyServicesService,
        CompanyService,
        MockProvider(DigitalDataService),
        ServicesFormsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(CompanyServicesService);
    fixture = TestBed.createComponent(ServiceStepConfigurationComponent);
    component = fixture.componentInstance;
    component.form = service.serviceConfigForm;
    component.errorMessages = errorServiceConfiguration;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
