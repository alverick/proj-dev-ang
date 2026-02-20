import { MockBuilder, MockRender } from 'ng-mocks';
import { DrawerModule } from 'primeng/drawer';

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
      .mock(DrawerModule),
  );

  it('should create', () => {
    const fixture = MockRender(ServiceResumePage);
    expect(fixture).toBeDefined();
  });
});
