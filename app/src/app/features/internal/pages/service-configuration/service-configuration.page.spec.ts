import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProviders } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';

import { environment } from '../../../../../environments/environment';
import {
  CompanyService,
  DigitalDataService,
  ServiceService,
  ServicesFormsService,
} from '../../../../shared/services';
import { StorageService } from '../../../../shared/services/storage.service';
import { CompanyServicesService } from '../../services';
import { ServiceConfigurationPage } from './service-configuration.page';

describe('ServiceConfigurationPage', () => {
  let component: ServiceConfigurationPage;
  let fixture: ComponentFixture<ServiceConfigurationPage>;

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
        ServicesFormsService,
        CompanyService,
        ServiceService,
        StorageService,
        MockProviders(DigitalDataService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
