import { NgClass } from '@angular/common';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { MessageAlertComponent } from './message-alert.component';

describe('MessageAlertComponent', () => {
  beforeEach(() => {
    return MockBuilder(MessageAlertComponent).keep(NgClass);
  });

  it('should apply the correct background class for info mode', () => {
    MockRender(MessageAlertComponent, { mode: 'info' });

    const messageElement = ngMocks.find('.message')
      .nativeElement as HTMLElement;
    expect(messageElement.classList.contains('tw-bg-info')).toBe(true);
  });

  it('should apply the correct background class for warning mode', () => {
    MockRender(MessageAlertComponent, { mode: 'warning' });

    const messageElement = ngMocks.find('.message')
      .nativeElement as HTMLElement;
    expect(messageElement.classList.contains('tw-bg-warning')).toBe(true);
  });

  it('should apply the correct background class for danger mode', () => {
    MockRender(MessageAlertComponent, { mode: 'danger' });

    const messageElement = ngMocks.find('.message')
      .nativeElement as HTMLElement;
    expect(messageElement.classList.contains('tw-bg-danger')).toBe(true);
  });
});
