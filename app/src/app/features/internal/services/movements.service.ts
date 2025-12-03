import { inject, Injectable } from '@angular/core';

import { DebtDataService } from '../../../shared/data';

@Injectable()
export class MovementsService {
  private readonly debtService = inject(DebtDataService);

  deleteMovements(ids) {
    return this.debtService.deleteAll(ids);
  }
}
