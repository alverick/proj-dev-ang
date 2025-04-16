import { Injectable } from '@angular/core';

import { DebtDataService } from '../../../shared/data';

@Injectable()
export class MovementsService {
  constructor(private readonly debtService: DebtDataService) {}

  deleteMovements(ids) {
    return this.debtService.deleteAll(ids);
  }
}
