import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-landing-carousel',
  templateUrl: './landing-carousel.component.html',
  styleUrls: ['./landing-carousel.component.scss'],
})
export class LandingCarouselComponent {
  @Input() items = [];
  @Input() styleIndicator: string;
}
