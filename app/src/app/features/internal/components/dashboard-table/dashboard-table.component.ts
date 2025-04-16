import { Component, Input } from '@angular/core';

import { TopClient } from '../../../../store/entities';

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
  @Input() printMode = false;
  @Input() customers: TopClient[] = [];
  @Input() currency = 'S/';
  @Input() loading = true;
  rows = ['1', '1', '1', '1'];
}
