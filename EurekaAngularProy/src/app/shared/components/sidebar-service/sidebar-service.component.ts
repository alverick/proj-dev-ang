import { Component, Input } from '@angular/core';

import { CurrencyWithLimit } from '../../constants/currencies';

@Component({
  selector: 'cs-sidebar-service',
  templateUrl: './sidebar-service.component.html',
  styleUrls: ['./sidebar-service.component.scss'],
})
export class SidebarServiceComponent {
  @Input() position: number;
  @Input() existServices = false;
  @Input() showAllTypes = true;
  @Input() currency: CurrencyWithLimit = null;
}
