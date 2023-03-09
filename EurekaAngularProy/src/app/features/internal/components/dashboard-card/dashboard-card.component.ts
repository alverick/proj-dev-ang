import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
})
export class DashboardCardComponent {
  @Input() title: string;
  @Input() currency: string;
  @Input() amount: number | string;
  @Input() printMode = false;
  @Output() link = new EventEmitter();
  @Input() peopleQuantity: number;

  goto() {
    this.link.emit();
  }
}
