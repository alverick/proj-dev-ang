import * as fromCompany from '../reducers/company.reducer';
import { selectCompanyState } from './company.selectors';

describe('Company Selectors', () => {
  it('should select the feature state', () => {
    const result = selectCompanyState({
      [fromCompany.companyFeatureKey]: {},
    });

    expect(result).toEqual({});
  });
});
