import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs/internal/Subject';
import { filter, takeUntil } from 'rxjs/operators';
import { IErrorMessages } from '../../models/forms';

@Component({
  selector: 'cs-service-step-info',
  templateUrl: './service-step-info.component.html',
  styleUrls: ['./service-step-info.component.scss'],
})
export class ServiceStepInfoComponent implements OnInit, OnDestroy {
  $destroy = new Subject();
  @Output() sendForm = new EventEmitter<object>();
  @Output() cancel = new EventEmitter();
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() accounts: any[];
  @Input() showCancel = false;

  ngOnInit() {
    this.form
      .get('account')
      .valueChanges.pipe(
        takeUntil(this.$destroy),
        filter((value) => isNotNil(value))
      )
      .subscribe(({ currency = '', id = '', number = '' }) => {
        if (isNotNilOrEmpty(number)) {
          const accountNumber = `${number.substr(0, 13)} (${
            currency === '001' ? 'Soles' : 'Dólares'
          })`;
          this.form.get('accountNumber').setValue(accountNumber);
          this.form.get('currency').setValue(currency);
          this.form.get('idAccount').setValue(id);
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      this.sendForm.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
