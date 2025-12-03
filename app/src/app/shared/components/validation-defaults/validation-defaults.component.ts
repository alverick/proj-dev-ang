import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  DefaultValidationErrorsDirective,
  DisplayMode,
  ValdemortConfig,
  ValidationErrorDirective,
} from 'ngx-valdemort';

@Component({
  selector: 'cs-validation-defaults',
  templateUrl: './validation-defaults.component.html',
  imports: [
    DefaultValidationErrorsDirective,
    ValidationErrorDirective,
    DecimalPipe,
  ],
})
export class ValidationDefaultsComponent {
  constructor() {
    const config = inject(ValdemortConfig);

    config.errorsClasses = 'error-messages';
    config.displayMode = DisplayMode.ONE;
    config.shouldDisplayErrors = (control, form) => form.submitted;
  }
}
