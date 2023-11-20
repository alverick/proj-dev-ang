import { Component, Input, OnInit } from '@angular/core';

/**
 * Message alert component for disclaimers
 */
@Component({
  selector: 'cs-message-alert',
  templateUrl: './message-alert.component.html',
  styleUrls: ['./message-alert.component.scss'],
})
export class MessageAlertComponent implements OnInit {
  /**
   * Mode for disclaimer
   */
  @Input() mode = '';
  bgClass = '';

  ngOnInit() {
    this.setBgClass();
  }
  setBgClass() {
    switch (this.mode) {
      case 'info':
        this.bgClass = 'tw-bg-info';
        break;
    }
  }
}
