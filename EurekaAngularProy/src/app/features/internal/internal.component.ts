import { Component } from '@angular/core';

import { fadeAnimation } from '../../shared/animations/page-transitions';

@Component({
  selector: 'cs-internal',
  templateUrl: './internal.component.html',
  animations: [fadeAnimation],
})
export class InternalComponent {}
