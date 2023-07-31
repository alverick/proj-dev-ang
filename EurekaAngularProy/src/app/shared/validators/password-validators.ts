import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

const regexValidator = (
  regex: RegExp,
  error: ValidationErrors,
  isForbidden: boolean = false
): ValidatorFn => {
  return (control: AbstractControl<string>): ValidationErrors => {
    if (!control.value) {
      return null;
    }
    const valid = regex.test(control.value);
    if (isForbidden) {
      return valid ? error : null;
    } else {
      return valid ? null : error;
    }
  };
};

const sequenceValidator =
  (regex: RegExp, error: ValidationErrors): ValidatorFn =>
  (control: AbstractControl<string>): ValidationErrors => {
    if (!control.value) {
      return null;
    }
    const pattern = '0123456789';
    const numbers = control.value.match(regex) || [];

    const searchNum = (num: string): boolean => {
      if (num.length > 3) {
        const numToString = num.toString();
        for (let index = 0; index < numToString.length - 2; index++) {
          const subNum = numToString.substring(index, index + 3);
          if (pattern.includes(subNum)) {
            return true;
          }
        }
      } else {
        return pattern.includes(num);
      }
    };

    const isSequencedNumber = numbers.find(
      (num: string) => num.length >= 3 && searchNum(num)
    );

    const valid = regex.test(control.value);
    return valid && !isSequencedNumber ? null : error;
  };

export const passwordValidators = [
  Validators.required,
  regexValidator(/^.{8,25}$/, { length: true }),
  regexValidator(/(?=.*[A-Z])/, { uppercase: true }),
  regexValidator(/(?=.*[a-z])/, { lowercase: true }),
  regexValidator(/\d+/, { numeric: true }),
  Validators.compose([
    regexValidator(/[^\w@!#$%&/()=?+*\-,.]+/, { symbol: true }, true),
    regexValidator(/(?=.*[@!#$%&/()=?+*\-,_.])/, { symbol: true }),
  ]),
  sequenceValidator(/\d+/g, {
    sequence: true,
  }),
];

export interface PasswordRulesMessage {
  message: string;
  key: string;
}

export const messageErrorNewPasswords: PasswordRulesMessage[] = [
  { key: 'length', message: 'Entre 8 y 25 caracteres.' },
  { key: 'uppercase', message: 'Al menos 1 letra MAYÚSCULA.' },
  { key: 'lowercase', message: 'Al menos 1 letra minúscula.' },
  { key: 'numeric', message: 'Al menos 1 número.' },
  { key: 'sequence', message: 'No más de 2 números consecutivos.' },
  { key: 'symbol', message: 'Al menos 1 símbolo @!#$%&/()=?+*-,_.' },
];
