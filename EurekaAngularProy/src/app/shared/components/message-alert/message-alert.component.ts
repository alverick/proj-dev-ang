import { Component, Input, OnChanges, type OnInit } from '@angular/core';

import {
  type MessageColor,
  type MessageModeType,
} from '../../constants/messages';

/**
 * Message alert component for disclaimers
 */
@Component({
  selector: 'cs-message-alert',
  templateUrl: './message-alert.component.html',
})
export class MessageAlertComponent implements OnInit, OnChanges {
  /**
   * Mode for disclaimer
   */
  @Input() mode: MessageModeType;
  bgClass = '';
  iconClass = '';
  colors: MessageColor = {
    info: { bg: 'tw-bg-info', icon: 'tw-text-secondary-blue-3' },
    warning: { bg: 'tw-bg-warning', icon: 'tw-text-extended-dark-yellow-1' },
  };

  ngOnInit() {
    this.setColorClass();
  }

  ngOnChanges(): void {
    this.setColorClass();
  }

  setColorClass() {
    this.bgClass = this.colors[this.mode].bg;
    this.iconClass = this.colors[this.mode].icon;
  }
}
