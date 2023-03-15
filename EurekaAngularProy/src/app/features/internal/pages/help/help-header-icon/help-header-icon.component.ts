import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-help-header-icon',
  templateUrl: './help-header-icon.component.html',
  styleUrls: ['./help-header-icon.component.scss'],
})
export class HelpHeaderIconComponent {
  @Input() activeIndex: number;
  @Input() position: number;
}
