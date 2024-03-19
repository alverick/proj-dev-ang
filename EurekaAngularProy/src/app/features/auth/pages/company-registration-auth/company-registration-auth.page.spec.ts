import { MockBuilder, MockRender } from 'ng-mocks';

import { SidebarServiceComponent } from '../../../../shared/components/sidebar-service/sidebar-service.component';
import { CompanyFormAuthComponent } from '../../components/company-form-auth/company-form-auth.component';
import { SidebarCompanyComponent } from '../../components/sidebar-company/sidebar-company.component';
import { AffiliationService } from '../../services';
import { CompanyRegistrationAuthPage } from './company-registration-auth.page';

describe('CompanyRegistrationPage', () => {
  beforeEach(() =>
    MockBuilder(CompanyRegistrationAuthPage)
      .mock(AffiliationService)
      .mock(SidebarServiceComponent)
      .mock(SidebarCompanyComponent)
      .mock(CompanyFormAuthComponent)
  );

  it('should create', () => {
    const fixture = MockRender(CompanyRegistrationAuthPage);
    expect(fixture).toBeTruthy();
  });
});
