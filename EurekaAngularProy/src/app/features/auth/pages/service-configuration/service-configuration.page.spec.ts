import { MockBuilder, MockRender } from 'ng-mocks';

import { ServiceStepConfigurationComponent } from '../../../../shared/components/service-step-configuration/service-step-configuration.component';
import { ServicesFormsService } from '../../../../shared/services';
import { AffiliationService } from '../../services';
import { ServiceConfigurationPage } from './service-configuration.page';

describe('ServiceConfigurationPage', () => {
  beforeEach(() =>
    MockBuilder(ServiceConfigurationPage)
      .mock(AffiliationService)
      .mock(ServicesFormsService)
      .mock(ServiceStepConfigurationComponent)
  );

  it('should create', () => {
    const fixture = MockRender(ServiceConfigurationPage);
    expect(fixture).toBeTruthy();
  });
});
