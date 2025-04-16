import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-dashboard-card',
  templateUrl: './dashboard-card.component.html',
})
export class DashboardCardComponent {
  @Input() title: string;
  @Input() currency: string;
  @Input() amount: number | string;
  @Input() printMode = false;
  @Input() loading = false;
  @Output() link = new EventEmitter();
  @Input() peopleQuantity: number;

  goto() {
    this.link.emit();
  }
}
