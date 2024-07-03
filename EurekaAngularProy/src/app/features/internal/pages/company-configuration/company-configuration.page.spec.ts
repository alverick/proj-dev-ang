import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProvider } from 'ng-mocks';
import { ValdemortModule } from 'ngx-valdemort';
import { DropdownModule } from 'primeng/dropdown';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SidebarModule } from 'primeng/sidebar';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { CompanyService } from '../../../../shared/services';
import { TrackingService } from '../../../../shared/services';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { CompanyPasswordFormComponent } from '../../components/company-password-form/company-password-form.component';
import { CompanyUpdateFormComponent } from '../../components/company-update-form/company-update-form.component';
import { CompanyConfigurationService } from '../../services';
import { CompanyConfigurationPage } from './company-configuration.page';

describe('CompanyConfigurationPage', () => {
  let component: CompanyConfigurationPage;
  let fixture: ComponentFixture<CompanyConfigurationPage>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [
        CompanyConfigurationPage,
        CompanyPasswordFormComponent,
        CompanyUpdateFormComponent,
        LabelControlComponent,
      ],
      imports: [
        CommonModule,
        DropdownModule,
        KeyFilterModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SidebarModule,
        ValdemortModule,
      ],
      providers: [
        CompanyService,
        CompanyConfigurationService,
        MockProvider(LoginService),
        NotifyService,
        TrackingService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
