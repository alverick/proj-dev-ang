import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';

import { environment } from '../../../../environments/environment';
import { CompanyServicesService } from '../../../features/internal/services';
import { errorServiceConfiguration } from '../../constants/company-errors';
import { type ModelFormGroup } from '../../models/forms';
import {
  CompanyService,
  DigitalDataService,
  ServiceService,
  ServicesFormsService,
} from '../../services';
import type { ServiceDebt } from '../../services/services-forms.service';
import { StorageService } from '../../services/storage.service';
import { ServiceDebtFormComponent } from './service-debt-form.component';

describe('ServiceDebtFormComponent', () => {
  let component: ServiceDebtFormComponent;
  let fixture: ComponentFixture<ServiceDebtFormComponent>;
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
    fixture = TestBed.createComponent(ServiceDebtFormComponent);
    component = fixture.componentInstance;
    component.form = service.editServiceForm.get(
      'debt',
    ) as ModelFormGroup<ServiceDebt>;
    component.errorMessages = errorServiceConfiguration;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
