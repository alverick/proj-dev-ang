import { Component, input } from '@angular/core';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'cs-service-channel-chip',
  imports: [ChipModule],
  templateUrl: './service-channel-chip.component.html',
})
export class ServiceChannelChipComponent {
  readonly amount = input<string>(undefined);
}
