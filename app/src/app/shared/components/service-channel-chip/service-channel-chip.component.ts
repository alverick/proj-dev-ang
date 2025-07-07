import { Component, Input } from '@angular/core';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'cs-service-channel-chip',
  standalone: true,
  imports: [ChipModule],
  templateUrl: './service-channel-chip.component.html',
})
export class ServiceChannelChipComponent {
  @Input() amount: string;
}
