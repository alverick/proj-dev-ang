import { MockBuilder, MockRender } from 'ng-mocks';
import { DrawerModule } from 'primeng/drawer';
import { StepsModule } from 'primeng/steps';

import { ServicesListComponent } from '../../../../shared/components/services-list/services-list.component';
import { AffiliationService } from '../../services';
import { UpdateServicesPage } from './update-services.page';

describe('UpdateServicesPage', () => {
  beforeEach(() =>
    MockBuilder(UpdateServicesPage)
      .mock(AffiliationService)
      .mock(ServicesListComponent)
      .mock(StepsModule)
      .mock(DrawerModule),
  );

  it('should create', () => {
    const fixture = MockRender(UpdateServicesPage);
    expect(fixture).toBeTruthy();
  });
});
