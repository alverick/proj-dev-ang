import type { AnimationEvent } from '@angular/animations';
import { Component } from '@angular/core';

import {
  fadeAnimation,
  phasesStateName,
} from '../../shared/animations/page-transitions';

@Component({
  selector: 'cs-internal',
  templateUrl: './internal.component.html',
  animations: [fadeAnimation],
})
export class InternalComponent {
  isAnimating = false;

  onAnimationEvent(event: AnimationEvent) {
    if (event.phaseName === phasesStateName.start) {
      this.isAnimating = true;
    }
    if (event.phaseName === phasesStateName.done) {
      this.isAnimating = false;
    }
  }
}
