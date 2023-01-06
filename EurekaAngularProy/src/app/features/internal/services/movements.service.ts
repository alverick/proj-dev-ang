import { Injectable } from '@angular/core';
import { DebtService } from '../../../shared/services/debt.service';

@Injectable()
export class MovementsService {
  constructor(private debtService: DebtService) {}

  deleteMovements(ids) {
    return this.debtService.deleteAll(ids);
  }
}
