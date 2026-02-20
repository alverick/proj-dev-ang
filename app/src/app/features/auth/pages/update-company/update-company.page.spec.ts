import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { DrawerModule } from 'primeng/drawer';

import { CompanyFormAuthComponent } from '../../components/company-form-auth/company-form-auth.component';
import { SidebarCompanyComponent } from '../../components/sidebar-company/sidebar-company.component';
import { AffiliationService } from '../../services';
import { UpdateCompanyPage } from './update-company.page';

describe('UpdateCompanyComponent', () => {
  beforeEach(() =>
    MockBuilder(UpdateCompanyPage)
      .mock(AffiliationService)
      .mock(RouterTestingModule)
      .mock(DrawerModule)
      .mock(SidebarCompanyComponent)
      .mock(CompanyFormAuthComponent),
  );

  it('should create', () => {
    const fixture = MockRender(UpdateCompanyPage);
    expect(fixture).toBeTruthy();
  });
});
