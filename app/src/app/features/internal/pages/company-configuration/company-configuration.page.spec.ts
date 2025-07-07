import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProvider } from 'ng-mocks';

import { CompanyService, ServiceService } from '../../../../shared/services';
import { TrackingService } from '../../../../shared/services';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { CompanyConfigurationService } from '../../services';
import { CompanyConfigurationPage } from './company-configuration.page';

describe('CompanyConfigurationPage', () => {
  let component: CompanyConfigurationPage;
  let fixture: ComponentFixture<CompanyConfigurationPage>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        CompanyService,
        CompanyConfigurationService,
        MockProvider(LoginService),
        NotifyService,
        TrackingService,
        ServiceService,
        StorageService,
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
