import { Component } from '@angular/core';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { SingleClickDirective } from './single-click.directive';

export function fakeTime(fn: () => void) {
  return () => {
    jest.useFakeTimers();
    fn();
    jest.useRealTimers();
  };
}

@Component({
  template: `
    <button [csSingleClick]="throttle" (singleClick)="onClick()">
      Click Me
    </button>
  `,
  standalone: true,
  imports: [SingleClickDirective],
})
class TestComponent {
  throttle = 5000;
  clickCount = 0;

  onClick() {
    this.clickCount++;
  }
}

describe('SingleClickDirective', () => {
  beforeEach(() => MockBuilder(TestComponent).keep(SingleClickDirective));

  it('should emit on single click', () => {
    const fixture = MockRender(TestComponent);
    const component = fixture.componentInstance;
    const button = ngMocks.find('button').nativeElement as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    expect(component.clickCount).toBe(1);
  });

  it(
    'should throttle multiple clicks',
    fakeTime(() => {
      const fixture = MockRender(TestComponent);
      const component = fixture.componentInstance;
      const button = ngMocks.find('button').nativeElement as HTMLButtonElement;

      button.click();
      button.click();
      button.click();
      fixture.detectChanges();

      expect(component.clickCount).toBe(1);

      jest.advanceTimersByTime(5000);
      button.click();
      fixture.detectChanges();

      expect(component.clickCount).toBe(2);
    }),
  );

  it('should clean up subscriptions on destroy', () => {
    const fixture = MockRender(TestComponent);
    const button = ngMocks.find('button').nativeElement as HTMLButtonElement;
    const directive = ngMocks.findInstance(SingleClickDirective);

    jest.spyOn(directive.singleClick, 'emit');
    fixture.destroy();

    button.click();
    expect(directive.singleClick.emit).not.toHaveBeenCalled();
  });
});
