import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProvider } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';
import { DrawerModule } from 'primeng/drawer';

import { environment } from '../../../../../environments/environment';
import {
  CompanyService,
  DigitalDataService,
  ServiceService,
  ServicesFormsService,
} from '../../../../shared/services';
import { StorageService } from '../../../../shared/services/storage.service';
import { CompanyServicesService } from '../../services';
import { CompanyServicesPage } from './company-services.page';

describe('CompanyServicesPage', () => {
  let component: CompanyServicesPage;
  let fixture: ComponentFixture<CompanyServicesPage>;

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
        DrawerModule,
        RouterTestingModule,
      ],
      providers: [
        CompanyService,
        CompanyServicesService,
        MockProvider(DigitalDataService),
        ServicesFormsService,
        ServiceService,
        StorageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
