import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-service-step-info',
  templateUrl: './service-step-info.component.html',
  styleUrls: ['./service-step-info.component.scss'],
})
export class ServiceStepInfoComponent implements OnInit, OnDestroy {
  $destroy = new Subject();
  @Output() sendForm = new EventEmitter<object>();
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() accounts: any[];

  constructor() {}

  ngOnInit() {
    this.form
      .get('account')
      .valueChanges.pipe(takeUntil(this.$destroy))
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
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
