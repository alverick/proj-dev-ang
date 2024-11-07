import { NgClass } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';

/**
 * Message alert component for disclaimers
 */
@Component({
  selector: 'cs-message-alert',
  templateUrl: './message-alert.component.html',
  standalone: true,
  imports: [NgClass],
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
    if (this.mode === 'info') {
      this.bgClass = 'tw-bg-info';
    }
  }
}
