import { NgClass } from '@angular/common';
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
  standalone: true,
  imports: [NgClass],
})
export class MessageAlertComponent implements OnInit, OnChanges {
  /**
   * Mode for disclaimer
   */
  @Input() mode: MessageModeType;
  bgClass = '';
  iconClass: string[] = [];
  colors: MessageColor = {
    info: {
      bg: 'tw-bg-info',
      icon: 'pi-info-circle',
      iconColor: 'tw-text-secondary-blue-3',
    },
    warning: {
      bg: 'tw-bg-warning',
      icon: 'pi-question-circle',
      iconColor: 'tw-text-extended-dark-yellow-1',
    },
    danger: {
      bg: 'tw-bg-danger',
      icon: 'pi-times-circle',
      iconColor: 'tw-text-extended-watermelon-1',
    },
  };

  ngOnInit() {
    this.setColorClass();
  }

  ngOnChanges(): void {
    this.setColorClass();
  }

  setColorClass() {
    this.bgClass = this.colors[this.mode].bg;
    this.iconClass = [
      this.colors[this.mode].iconColor,
      this.colors[this.mode].icon,
    ];
  }
}
