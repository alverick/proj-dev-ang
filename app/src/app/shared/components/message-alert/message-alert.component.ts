import { NgClass } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
  imports: [NgClass],
})
export class MessageAlertComponent implements OnChanges {
  /**
   * Mode for disclaimer
   */
  @Input() mode: MessageModeType = 'info';

  bgClass = 'tw-bg-info';
  iconClass: string[] = ['pi-info-circle', 'tw-text-secondary-blue-3'];
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']?.currentValue) {
      this.setColorClass();
    }
  }

  private setColorClass(): void {
    const colorConfig = this.colors[this.mode];
    if (colorConfig) {
      this.bgClass = colorConfig.bg;
      this.iconClass = [colorConfig.iconColor, colorConfig.icon];
    }
  }
}
