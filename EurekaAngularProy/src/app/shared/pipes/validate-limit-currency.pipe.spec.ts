import { currencies, type CurrencyWithLimit } from '../constants/currencies';
import { ValidateLimitCurrencyPipe } from './validate-limit-currency.pipe';

describe('ValidateLimitCurrencyPipe', () => {
  let pipe: ValidateLimitCurrencyPipe;
  const mockLimits: CurrencyWithLimit[] = [
    {
      ...currencies[0],
      limitMax: 1000.0,
    },
    { ...currencies[1], limitMax: 5000.0 },
  ];

  beforeEach(() => {
    pipe = new ValidateLimitCurrencyPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return false if validate is false, regardless of amount', () => {
    expect(pipe.transform(1500, mockLimits, '$', false)).toBe(false);
    expect(pipe.transform(1000, mockLimits, '$', false)).toBe(false);
    expect(pipe.transform(500, mockLimits, '$', false)).toBe(false);
  });

  describe('when validate is true', () => {
    it('should return true if amount is strictly greater than the limit for the selected currency', () => {
      expect(pipe.transform(5000.01, mockLimits, '$', true)).toBe(true);
      expect(pipe.transform(1001, mockLimits, 'S/', true)).toBe(true);
    });

    it('should return false if amount is equal to the limit for the selected currency', () => {
      expect(pipe.transform(5000.0, mockLimits, '$', true)).toBe(false);
      expect(pipe.transform(1000.0, mockLimits, 'S/', true)).toBe(false);
    });

    it('should return false if amount is less than the limit for the selected currency', () => {
      expect(pipe.transform(999.99, mockLimits, '$', true)).toBe(false);
      expect(pipe.transform(0, mockLimits, '$', true)).toBe(false);
      expect(pipe.transform(-100, mockLimits, '$', true)).toBe(false);
      expect(pipe.transform(999, mockLimits, 'S/', true)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should throw an error if the selected currency is not found in maxAmountLimits', () => {
      expect(() => pipe.transform(100, mockLimits, 'JPY', true)).toThrowError();
    });

    it('should throw an error if maxAmountLimits is empty', () => {
      const emptyLimits: CurrencyWithLimit[] = [];
      expect(() => pipe.transform(100, emptyLimits, '$', true)).toThrowError();
    });

    it('should throw an error if maxAmountLimits is null or undefined (though unlikely with TypeScript)', () => {
      expect(() => pipe.transform(100, null, '$', true)).toThrowError();
      expect(() => pipe.transform(100, undefined, '$', true)).toThrowError();
    });
  });
});
