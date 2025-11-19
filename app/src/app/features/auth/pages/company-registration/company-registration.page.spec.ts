import { Router } from '@angular/router';
import { MockBuilder, MockRender } from 'ng-mocks';

import { SidebarServiceComponent } from '../../../../shared/components/sidebar-service/sidebar-service.component';
import { CompanyFormRegistrationComponent } from '../../components/company-form-registration/company-form-registration.component';
import { SidebarCompanyComponent } from '../../components/sidebar-company/sidebar-company.component';
import { AffiliationService } from '../../services';
import { CompanyRegistrationPage } from './company-registration.page';

describe('CompanyRegistrationPage', () => {
  beforeEach(() => {
    // Define the mock implementation for AffiliationService
    const affiliationServiceMock = {
      registerForm: {
        get: () => ({
          setValue: () => {},
        }),
      },
      resetRegistration: () => {},
    };

    return (
      MockBuilder(CompanyRegistrationPage)
        // Use .provide() to supply the mock implementation
        .provide({
          provide: AffiliationService,
          useValue: affiliationServiceMock,
        })
        .mock(SidebarServiceComponent)
        .mock(SidebarCompanyComponent)
        .mock(CompanyFormRegistrationComponent)
        .mock(Router, {
          getCurrentNavigation: () => ({
            extras: {
              state: {
                initNew: true,
              },
            },
          }),
        } as any)
    );
  });

  it('should create', () => {
    const fixture = MockRender(CompanyRegistrationPage);
    expect(fixture.point.componentInstance).toBeTruthy();
  });
});
