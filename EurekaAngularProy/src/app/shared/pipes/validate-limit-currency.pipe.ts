import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyWithLimit } from '../constants/currencies';

@Pipe({
  name: 'validateLimitCurrency',
})
export class ValidateLimitCurrencyPipe implements PipeTransform {
  transform(
    amount: number,
    maxAmountLimits: CurrencyWithLimit[],
    currencySel: string,
    validate: boolean
  ): boolean {
    if (!validate) {
      return false;
    }
    const limit = maxAmountLimits.find(
      (currency) => currency.symbol === currencySel
    ).limitMax;
    return amount > limit;
  }
}
