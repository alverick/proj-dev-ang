import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { PrimeTemplate } from 'primeng/api';

import { CurrencyWithLimit } from '../../constants/currencies';

@Component({
  selector: 'cs-sidebar-service',
  templateUrl: './sidebar-service.component.html',
  styleUrls: ['./sidebar-service.component.scss'],
  standalone: true,
  imports: [AccordionModule, PrimeTemplate, CurrencyPipe],
})
export class SidebarServiceComponent {
  @Input() position: number;
  @Input() existServices = false;
  @Input() showAllTypes = true;
  @Input() currency: CurrencyWithLimit = null;
}
