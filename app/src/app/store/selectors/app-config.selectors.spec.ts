import * as fromAppConfig from '../reducers/app-config.reducer';
import { selectAppConfigState } from './app-config.selectors';

describe('AppConfig Selectors', () => {
  it('should select the feature state', () => {
    const result = selectAppConfigState({
      [fromAppConfig.appConfigFeatureKey]: {},
    });

    expect(result).toEqual({});
  });
});
