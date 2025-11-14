import type { AnimationEvent } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  fadeAnimation,
  phasesStateName,
} from '../../shared/animations/page-transitions';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { InternalHeaderComponent } from './components/internal-header/internal-header.component';

@Component({
    selector: 'cs-internal',
    templateUrl: './internal.component.html',
    animations: [fadeAnimation],
    standalone: true,
    imports: [InternalHeaderComponent, NgClass, RouterOutlet, FooterComponent]
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
