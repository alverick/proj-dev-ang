import { Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { type PasswordRulesMessage } from '../../validators/password-validators';

@Component({
  selector: 'cs-control-rules-policies',
  templateUrl: './control-rules-policies.component.html',
})
export class ControlRulesPoliciesComponent {
  @Input() control: UntypedFormControl;
  @Input() rules: PasswordRulesMessage[] = [];

  ruleTrackBy(_index: number, rule: PasswordRulesMessage) {
    return rule.key;
  }
}
