import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AmountMaxValidateDirective } from './amount-max-validate.directive';

@Component({
  template: `
    <input
      type="number"
      [formControl]="amountControl"
      csAmountMaxValidate
      [maxAmountLimits]="maxAmountLimits"
      [currencySymbol]="currencySymbol"
      [useLimits]="useLimits"
    />
  `,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AmountMaxValidateDirective],
})
class TestComponent {
  amountControl = new FormControl('');
  maxAmountLimits = [{ symbol: 'S/', limitMax: 1000 }];
  currencySymbol = 'S/';
  useLimits = true;
}

describe('AmountMaxValidateDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.children[0].injector.get(
      AmountMaxValidateDirective,
    );
    expect(directive).toBeTruthy();
  });

  it('should be valid when value is less than or equal to the limit', () => {
    component.amountControl.setValue('500');
    expect(component.amountControl.valid).toBe(true);
  });

  it('should be invalid when value is greater than the limit', () => {
    component.amountControl.setValue('1500');
    expect(component.amountControl.invalid).toBe(true);
    expect(component.amountControl.errors?.['amountMax']).toBe(true);
  });

  it('should be valid when useLimits is false', () => {
    component.useLimits = false;
    fixture.detectChanges();
    component.amountControl.setValue('1500');
    expect(component.amountControl.valid).toBe(true);
  });

  it('should be valid when control value is empty', () => {
    component.amountControl.setValue('');
    expect(component.amountControl.valid).toBe(true);
  });
});
