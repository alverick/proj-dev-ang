import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProvider } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';
import { SidebarModule } from 'primeng/sidebar';

import { environment } from '../../../../../environments/environment';
import { ServicesListComponent } from '../../../../shared/components/services-list/services-list.component';
import {
  CompanyService,
  DigitalDataService,
  ServicesFormsService,
} from '../../../../shared/services';
import { CompanyServicesService } from '../../services';
import { CompanyServicesPage } from './company-services.page';

describe('CompanyServicesPage', () => {
  let component: CompanyServicesPage;
  let fixture: ComponentFixture<CompanyServicesPage>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [CompanyServicesPage, ServicesListComponent],
      imports: [
        HttpClientTestingModule,
        LoggerModule.forRoot({
          level: environment.logLevel,
          serverLogLevel: environment.serverLogLevel,
          disableConsoleLogging: false,
          enableSourceMaps: true,
        }),
        SidebarModule,
        RouterTestingModule,
      ],
      providers: [
        CompanyService,
        CompanyServicesService,
        MockProvider(DigitalDataService),
        ServicesFormsService,
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
