import { Component, Input } from '@angular/core';

import { TopClients } from '../../../../shared/data/dashboard-data.service';

export interface Customer {
  id: string;
  name: string;
  service: string;
  currency: string;
  totalAmount: string;
  delayAmount: string;
}

@Component({
  selector: 'cs-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.scss'],
})
export class DashboardTableComponent {
  @Input() customers: TopClients[] = [];
}
