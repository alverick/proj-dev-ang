import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProviders } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';

import { environment } from '../../../../../environments/environment';
import { ServicesFormsService } from '../../../../shared/services';
import { StorageService } from '../../../../shared/services/storage.service';
import { CompanyServicesService } from '../../services';
import { ServiceConfigurationPage } from './service-configuration.page';

describe('ServiceConfigurationPage', () => {
  let component: ServiceConfigurationPage;
  let fixture: ComponentFixture<ServiceConfigurationPage>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [MockComponent(ServiceConfigurationPage)],
      imports: [
        LoggerModule.forRoot({
          level: environment.logLevel,
          serverLogLevel: environment.serverLogLevel,
          disableConsoleLogging: false,
          enableSourceMaps: true,
        }),
      ],
      providers: [
        MockProviders(CompanyServicesService, ServicesFormsService),
        StorageService,
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
