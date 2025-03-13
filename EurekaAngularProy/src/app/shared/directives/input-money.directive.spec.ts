import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { InputMoneyDirective } from './input-money.directive';

@Component({
  template: `<input type="text" [formControl]="moneyControl" csInputMoney />`,
  standalone: true,
  imports: [ReactiveFormsModule, InputMoneyDirective],
})
class TestHostComponent {
  moneyControl = new FormControl<string | null>(null);
}

describe('InputMoneyDirective (with Jest)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputEl: DebugElement;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InputMoneyDirective, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;

    inputEl = fixture.debugElement.query(By.directive(InputMoneyDirective));
    inputElement = inputEl.nativeElement as HTMLInputElement;

    fixture.detectChanges();
  });

  it('should create an instance attached to the input element', () => {
    const directiveInstance = inputEl.injector.get(InputMoneyDirective);
    expect(directiveInstance).toBeTruthy();
  });

  describe('onInputChange', () => {
    const dispatchInputEvent = (value: string) => {
      inputElement.value = value;
      const event = new InputEvent('input', { bubbles: true, data: value });
      inputElement.dispatchEvent(event);
      fixture.detectChanges();
    };

    it('should remove non-numeric characters except dot', () => {
      dispatchInputEvent('1a2b3c$4');
      expect(inputElement.value).toBe('1234');
    });

    it('should allow numbers and a single dot', () => {
      dispatchInputEvent('123.45');
      expect(inputElement.value).toBe('123.45');
    });

    it('should replace consecutive dots with a single dot', () => {
      dispatchInputEvent('1..2');
      expect(inputElement.value).toBe('1.2');
      dispatchInputEvent('1...3');
      expect(inputElement.value).toBe('1.3');
    });

    it('should allow multiple non-consecutive dots (based on current regex)', () => {
      dispatchInputEvent('1.2.3');
      expect(inputElement.value).toBe('1.2.3');
    });

    it('should allow input starting with a dot', () => {
      dispatchInputEvent('.50');
      expect(inputElement.value).toBe('.50');
    });

    it('should handle empty input', () => {
      dispatchInputEvent('');
      expect(inputElement.value).toBe('');
    });

    it('should handle only invalid characters, resulting in empty string', () => {
      dispatchInputEvent('abc-@#');
      expect(inputElement.value).toBe('');
    });
  });

  describe('onBlur', () => {
    const dispatchBlurEvent = () => {
      const event = new FocusEvent('blur');
      inputElement.dispatchEvent(event);
      fixture.detectChanges();
    };

    const setInputValueAndBlur = (value: string | null) => {
      component.moneyControl.setValue(value);
      fixture.detectChanges();

      inputElement.value = value ?? '';
      fixture.detectChanges();

      dispatchBlurEvent();
    };

    it('should format integer value to two decimal places on blur', () => {
      setInputValueAndBlur('123');
      expect(component.moneyControl.value).toBe('123.00');
    });

    it('should format value with one decimal place to two on blur', () => {
      setInputValueAndBlur('45.6');
      expect(component.moneyControl.value).toBe('45.60');
    });

    it('should keep value with two decimal places as is on blur', () => {
      setInputValueAndBlur('78.90');
      expect(component.moneyControl.value).toBe('78.90');
    });

    it('should format value with more than two decimal places (rounding) on blur', () => {
      setInputValueAndBlur('12.345');
      expect(component.moneyControl.value).toBe('12.35');

      setInputValueAndBlur('12.341');
      expect(component.moneyControl.value).toBe('12.34');
    });

    it('should format value starting with dot on blur', () => {
      setInputValueAndBlur('.5');
      expect(component.moneyControl.value).toBe('0.50');
    });

    it('should format value ending with dot on blur', () => {
      setInputValueAndBlur('15.');
      expect(component.moneyControl.value).toBe('15.00');
    });

    it('should not change control value if input is empty on blur', () => {
      setInputValueAndBlur('');

      expect(component.moneyControl.value).toBe('');
    });

    it('should not change control value if input is null on blur', () => {
      setInputValueAndBlur(null);

      expect(component.moneyControl.value).toBeNull();
    });

    it('should not change control value if input is just a dot on blur', () => {
      setInputValueAndBlur('.');

      expect(component.moneyControl.value).toBe('.');
    });

    it('should handle large numbers correctly', () => {
      setInputValueAndBlur('123456789.1');
      expect(component.moneyControl.value).toBe('123456789.10');
    });
  });
});
