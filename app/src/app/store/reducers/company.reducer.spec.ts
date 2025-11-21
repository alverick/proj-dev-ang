import { companyFeature, initialState } from './company.reducer';

describe('Company Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = companyFeature.reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
