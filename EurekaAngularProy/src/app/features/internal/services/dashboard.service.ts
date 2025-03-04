import { Injectable } from '@angular/core';

import { DashboardDataService } from '../../../shared/data';
import { CompanyService } from '../../../shared/services';

@Injectable()
export class DashboardService {
  constructor(
    private readonly company: CompanyService,
    private readonly dashboard: DashboardDataService,
  ) {}

  getServices() {
    return this.company.getCompanyServices(true);
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

  sendEmail(data: FormData) {
    return this.dashboard.sendEmail(data);
  }
}
