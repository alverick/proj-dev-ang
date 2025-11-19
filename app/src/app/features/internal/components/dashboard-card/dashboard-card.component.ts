import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { NotEmptyPipe } from '../../../../shared/pipes/not-empty.pipe';

@Component({
  selector: 'cs-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  imports: [CurrencyPipe, NgClass, NotEmptyPipe],
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
