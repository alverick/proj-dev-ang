import { MockBuilder, MockRender } from 'ng-mocks';

import { AffiliationService } from '../../services';
import { RegistrationFinishedPage } from './registration-finished.page';

describe('RegistrationFinishedPage', () => {
  beforeEach(() =>
    MockBuilder(RegistrationFinishedPage).mock(AffiliationService),
  );

  it('should create', () => {
    const fixture = MockRender(RegistrationFinishedPage);
    expect(fixture).toBeTruthy();
  });
});
