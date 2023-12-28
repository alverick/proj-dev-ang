import { ValidateLimitCurrencyPipe } from './validate-limit-currency.pipe';

describe('ValidateLimitCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new ValidateLimitCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
