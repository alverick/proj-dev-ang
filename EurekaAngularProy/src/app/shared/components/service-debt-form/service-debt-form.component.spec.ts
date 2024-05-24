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
import { type ModelFormGroup } from '../../models/forms';
import {
  CompanyService,
  DigitalDataService,
  ServicesFormsService,
} from '../../services';
import type { ServiceDebt } from '../../services/services-forms.service';
import { LabelControlComponent } from '../label-control/label-control.component';
import { ServiceDebtFormComponent } from './service-debt-form.component';

describe('ServiceDebtFormComponent', () => {
  let component: ServiceDebtFormComponent;
  let fixture: ComponentFixture<ServiceDebtFormComponent>;
  let service: CompanyServicesService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [ServiceDebtFormComponent, LabelControlComponent],
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
        ReactiveFormsModule,
        FormsModule,
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
    fixture = TestBed.createComponent(ServiceDebtFormComponent);
    component = fixture.componentInstance;
    component.form = service.editServiceForm.get(
      'debt'
    ) as ModelFormGroup<ServiceDebt>;
    component.errorMessages = errorServiceConfiguration;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
