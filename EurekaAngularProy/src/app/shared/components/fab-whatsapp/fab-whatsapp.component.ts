import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { pathEq } from 'ramda';

@Component({
  selector: 'cs-fab-whatsapp',
  templateUrl: './fab-whatsapp.component.html',
  styleUrls: ['./fab-whatsapp.component.scss'],
})
export class FabWhatsappComponent implements OnChanges {
  @Input() showButton = true;
  showText = true;
  timeToHide = 10000;
  constructor() {
    setTimeout(() => (this.showText = false), this.timeToHide);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (pathEq(['showButton', 'currentValue'], true, changes)) {
      this.showText = true;
      setTimeout(() => (this.showText = false), this.timeToHide);
    }
  }
}
