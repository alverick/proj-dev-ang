import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { SidebarModule } from 'primeng/sidebar';

import { CompanyFormAuthComponent } from '../../components/company-form-auth/company-form-auth.component';
import { SidebarCompanyComponent } from '../../components/sidebar-company/sidebar-company.component';
import { AffiliationService } from '../../services';
import { UpdateCompanyPage } from './update-company.page';

describe('UpdateCompanyComponent', () => {
  beforeEach(() =>
    MockBuilder(UpdateCompanyPage)
      .mock(AffiliationService)
      .mock(RouterTestingModule)
      .mock(SidebarModule)
      .mock(SidebarCompanyComponent)
      .mock(CompanyFormAuthComponent),
  );

  it('should create', () => {
    const fixture = MockRender(UpdateCompanyPage);
    expect(fixture).toBeTruthy();
  });
});
