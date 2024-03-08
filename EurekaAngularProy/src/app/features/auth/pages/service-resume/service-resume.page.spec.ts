import { MockBuilder, MockRender } from 'ng-mocks';
import { SidebarModule } from 'primeng/sidebar';

import { ServiceEditFormComponent } from '../../../../shared/components/service-edit-form/service-edit-form.component';
import { ServicesListComponent } from '../../../../shared/components/services-list/services-list.component';
import { ServicesFormsService } from '../../../../shared/services';
import { AffiliationService } from '../../services';
import { ServiceResumePage } from './service-resume.page';

describe('ServiceListPage', () => {
  beforeEach(() =>
    MockBuilder(ServiceResumePage)
      .mock(ServicesFormsService)
      .mock(AffiliationService)
      .mock(ServicesListComponent)
      .mock(ServiceEditFormComponent)
      .mock(SidebarModule)
  );

  it('should create', () => {
    const fixture = MockRender(ServiceResumePage);
    expect(fixture).toBeDefined();
  });
});
