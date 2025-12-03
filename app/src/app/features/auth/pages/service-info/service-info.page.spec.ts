import { MockBuilder, MockRender } from 'ng-mocks';

import { ServiceStepInfoComponent } from '../../../../shared/components/service-step-info/service-step-info.component';
import {
  ServicesFormsService,
  TrackingService,
} from '../../../../shared/services';
import { StorageService } from '../../../../shared/services/storage.service';
import { AffiliationService } from '../../services';
import { ServiceInfoPage } from './service-info.page';

describe('ServiceInfoPage', () => {
  beforeEach(() =>
    MockBuilder(ServiceInfoPage)
      .mock(AffiliationService)
      .mock(ServicesFormsService)
      .mock(ServiceStepInfoComponent)
      .mock(TrackingService)
      .mock(StorageService),
  );

  it('should create', () => {
    const fixture = MockRender(ServiceInfoPage);
    expect(fixture.point.componentInstance).toBeDefined();
  });
});
