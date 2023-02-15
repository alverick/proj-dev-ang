import { Injectable } from '@angular/core';

import { DashboardDataService } from '../../../shared/data';
import { CompanyService } from '../../../shared/services';

@Injectable()
export class DashboardService {
  constructor(
    private company: CompanyService,
    private dashboard: DashboardDataService
  ) {}

  getServices() {
    return this.company.getCompanyServices(false);
  }

  getCollect(data) {
    return this.dashboard.getAmounts(data);
  }

  getClients(data) {
    return this.dashboard.getClients(data);
  }

  getHistorical(data) {
    return this.dashboard.getHistorical(data);
  }
}
