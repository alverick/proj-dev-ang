import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
})
export class DashboardCardComponent {
  @Input() title: string;
  @Input() currency: string;
  @Input() amount: number | string;
  @Input() link: number;
  @Input() peopleQuantity: number;
}
