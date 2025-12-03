import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { PrimeTemplate } from 'primeng/api';

import { CurrencyWithLimit } from '../../constants/currencies';

@Component({
  selector: 'cs-sidebar-service',
  templateUrl: './sidebar-service.component.html',
  styleUrls: ['./sidebar-service.component.scss'],
  imports: [AccordionModule, PrimeTemplate, CurrencyPipe],
})
export class SidebarServiceComponent {
  readonly position = input<number>(undefined);
  readonly existServices = input(false);
  readonly showAllTypes = input(false);
  readonly currency = input<CurrencyWithLimit>(null);
}
