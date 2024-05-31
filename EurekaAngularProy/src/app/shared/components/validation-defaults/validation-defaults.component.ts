import { Component } from '@angular/core';
import { DisplayMode, ValdemortConfig } from 'ngx-valdemort';

@Component({
  selector: 'cs-validation-defaults',
  templateUrl: './validation-defaults.component.html',
})
export class ValidationDefaultsComponent {
  constructor(config: ValdemortConfig) {
    config.errorsClasses = 'error-messages';
    config.displayMode = DisplayMode.ONE;
    config.shouldDisplayErrors = (control, form) => form.submitted;
  }
}
