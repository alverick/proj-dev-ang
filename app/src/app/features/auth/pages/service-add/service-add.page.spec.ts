import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { StepsModule } from 'primeng/steps';

import { SidebarServiceComponent } from '../../../../shared/components/sidebar-service/sidebar-service.component';
import { AffiliationService } from '../../services';
import { ServiceAddPage } from './service-add.page';

describe('ServiceAddPage', () => {
  beforeEach(() =>
    MockBuilder(ServiceAddPage)
      .mock(AffiliationService)
      .mock(SidebarServiceComponent)
      .mock(RouterTestingModule)
      .mock(StepsModule),
  );

  it('should create', () => {
    const fixture = MockRender(ServiceAddPage);
    expect(fixture).toBeTruthy();
  });
});
