import { MockBuilder, MockRender } from 'ng-mocks';

import { SidebarServiceComponent } from '../../../../shared/components/sidebar-service/sidebar-service.component';
import { CompanyFormRegistrationComponent } from '../../components/company-form-registration/company-form-registration.component';
import { SidebarCompanyComponent } from '../../components/sidebar-company/sidebar-company.component';
import { AffiliationService } from '../../services';
import { CompanyRegistrationPage } from './company-registration.page';

describe('CompanyRegistrationPage', () => {
  beforeEach(() =>
    MockBuilder(CompanyRegistrationPage)
      .mock(AffiliationService)
      .mock(SidebarServiceComponent)
      .mock(SidebarCompanyComponent)
      .mock(CompanyFormRegistrationComponent)
  );

  it('should create', () => {
    const fixture = MockRender(CompanyRegistrationPage);
    expect(fixture).toBeTruthy();
  });
});
