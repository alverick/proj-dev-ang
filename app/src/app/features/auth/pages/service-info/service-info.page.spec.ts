import { MockBuilder, MockRender } from 'ng-mocks';

import { ServiceStepInfoComponent } from '../../../../shared/components/service-step-info/service-step-info.component';
import { ServicesFormsService } from '../../../../shared/services';
import { AffiliationService } from '../../services';
import { ServiceInfoPage } from './service-info.page';

describe('ServiceInfoPage', () => {
  beforeEach(() =>
    MockBuilder(ServiceInfoPage)
      .mock(AffiliationService)
      .mock(ServicesFormsService)
      .mock(ServiceStepInfoComponent),
  );

  it('should create', () => {
    const fixture = MockRender(ServiceInfoPage);
    expect(fixture).toBeDefined();
  });
});
