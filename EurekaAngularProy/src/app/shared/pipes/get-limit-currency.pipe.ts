import { type PipeTransform, Pipe } from '@angular/core';

import { type CurrencyWithLimit } from '../constants/currencies';

@Pipe({
  name: 'getLimitCurrency',
})
export class GetLimitCurrencyPipe implements PipeTransform {
  transform(currencySel: string, maxAmountLimits: CurrencyWithLimit[]) {
    return maxAmountLimits.find((currency) => currency.symbol === currencySel)
      .limitMax;
  }
}
