import { Component } from '@angular/core';

import { fadeAnimation } from '../../shared/animations/page-transitions';

@Component({
  selector: 'cs-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss'],
  animations: [fadeAnimation],
})
export class InternalComponent {}
