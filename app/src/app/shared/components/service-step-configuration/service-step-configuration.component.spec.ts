import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';

import { environment } from '../../../../environments/environment';
import { CompanyServicesService } from '../../../features/internal/services';
import { errorServiceConfiguration } from '../../constants/company-errors';
import {
  CompanyService,
  DigitalDataService,
  ServiceService,
  ServicesFormsService,
} from '../../services';
import { StorageService } from '../../services/storage.service';
import { ServiceStepConfigurationComponent } from './service-step-configuration.component';

describe('ServiceStepConfigurationComponent', () => {
  let component: ServiceStepConfigurationComponent;
  let fixture: ComponentFixture<ServiceStepConfigurationComponent>;
  let service: CompanyServicesService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerModule.forRoot({
          level: environment.logLevel,
          serverLogLevel: environment.serverLogLevel,
          disableConsoleLogging: false,
          enableSourceMaps: true,
        }),
      ],
      providers: [
        CompanyServicesService,
        CompanyService,
        MockProvider(DigitalDataService),
        ServicesFormsService,
        ServiceService,
        StorageService,
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
