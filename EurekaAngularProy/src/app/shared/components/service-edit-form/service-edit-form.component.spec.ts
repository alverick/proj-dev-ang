import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { LoggerModule } from 'ngx-logger';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';

import { environment } from '../../../../environments/environment';
import { CompanyServicesService } from '../../../features/internal/services';
import { errorServiceConfiguration } from '../../constants/company-errors';
import {
  CompanyService,
  DigitalDataService,
  ServicesFormsService,
} from '../../services';
import { LabelControlComponent } from '../label-control/label-control.component';
import { ServiceEditFormComponent } from './service-edit-form.component';

describe('ServiceEditFormComponent', () => {
  let component: ServiceEditFormComponent;
  let fixture: ComponentFixture<ServiceEditFormComponent>;
  let service: CompanyServicesService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [ServiceEditFormComponent, LabelControlComponent],
      imports: [
        CheckboxModule,
        DropdownModule,
        MessagesModule,
        MessageModule,
        LoggerModule.forRoot({
          level: environment.logLevel,
          serverLogLevel: environment.serverLogLevel,
          disableConsoleLogging: false,
          enableSourceMaps: true,
        }),
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
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
    service = TestBed.inject(CompanyServicesService);
    fixture = TestBed.createComponent(ServiceEditFormComponent);
    component = fixture.componentInstance;
    component.form = service.editServiceForm;
    component.errorMessages = errorServiceConfiguration;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
