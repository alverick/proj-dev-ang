import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import * as moment from 'moment';
import { forEachObjIndexed, isNil, keys } from 'ramda';
import { isNotNil, isNotNilOrEmpty, isObj } from 'ramda-adjunct';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { Date } from '../../../../../../shared/models/date';
import { WayPay } from '../../../../../../shared/models/way-pay';

const errorMessageDates = {
  required: 'Ingrese una fecha',
  invalid: 'Fecha Inválida',
  beforeFrom: 'Fecha Inválida',
  matDatepickerParse: 'Fecha Inválida',
};

@Component({
  selector: 'cs-payments-filter',
  templateUrl: './payments-filter.component.html',
  styleUrls: ['./payments-filter.component.scss'],
})
export class PaymentsFilterComponent implements OnInit, OnDestroy {
  @Input() DateList: Date[];
  @Input() services: any[];
  @Input() waypayList: WayPay[];
  @Output() sendForm = new EventEmitter<object>();
  @Output() resetForm = new EventEmitter();

  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  minDateTo = new Date(2000, 0, 1);
  maxDateFrom = new Date(2050, 0, 1);
  formSubmitted = false;
  formFilled = false;
  errorDateFrom = '';
  errorDateTo = '';

  private readonly dateValidators = [
    this.validDateValidator(),
    this.validDateOrderValidator(),
  ];

  form = new FormGroup({
    inputSearch: new FormControl(''),
    service: new FormControl(''),
    status: new FormControl(''),
    dateForFilter: new FormControl(''),
    dateFrom: new FormControl({ value: '', disabled: true }),
    dateTo: new FormControl({ value: '', disabled: true }),
  });

  $destroy = new Subject();

  ngOnInit() {
    this.updateValidatorsDates();
    this.parseDates();
    this.listenChangesForm();
  }

  private listenChangesForm() {
    this.form.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe((formFields) => {
        this.formFilled = false;
        forEachObjIndexed((valueField) => {
          if (isNotNilOrEmpty(valueField)) {
            this.formFilled = true;
          }
        }, formFields);
      });
  }

  private parseDates() {
    const compareDates =
      (control, isLower = false) =>
      (value: moment.Moment) => {
        if (isNotNil(value) && isObj(value)) {
          if (
            (!isLower && control.value < value) ||
            (isLower && control.value > value)
          ) {
            control.reset();
          }
        }
        this.setMessagesErrorDate();
      };
    this.form
      .get('dateFrom')
      .valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe(compareDates(this.form.get('dateTo')));

    this.form
      .get('dateTo')
      .valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe(compareDates(this.form.get('dateFrom'), true));
  }

  setMessagesErrorDate() {
    const { dateTo, dateFrom } = this.form.controls;
    const processErrors = (field, errorMessage) => {
      const errorTypes = keys(field.errors);
      this[errorMessage] =
        errorTypes.length > 0 ? errorMessageDates[errorTypes[0]] : '';
    };

    processErrors(dateFrom, 'errorDateFrom');
    processErrors(dateTo, 'errorDateTo');
  }

  private updateValidatorsDates() {
    this.form
      .get('dateForFilter')
      .valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        const { dateTo, dateFrom } = this.form.controls;
        if (isNil(value)) {
          dateFrom.disable();
          dateTo.disable();
          dateFrom.setValidators(this.dateValidators);
          dateTo.setValidators(this.dateValidators);
        } else {
          dateFrom.enable();
          dateTo.enable();
          dateFrom.setValidators([Validators.required, ...this.dateValidators]);
          dateTo.setValidators([Validators.required, ...this.dateValidators]);
        }

        dateFrom.updateValueAndValidity();
        dateTo.updateValueAndValidity();
      });
  }

  cleanAllFilters() {
    this.form.reset();
    this.resetForm.emit();
  }

  validDateValidator(): ValidatorFn {
    return ({ value }: AbstractControl): ValidationErrors | null => {
      const error = { invalid: { value } };
      if (
        isNotNilOrEmpty(value) &&
        (value.toDate() < this.minDate || value.toDate() > this.maxDate)
      ) {
        return error;
      } else {
        return null;
      }
    };
  }

  validDateOrderValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      const error = { beforeFrom: true };
      const dateTo = this.form.get('dateTo').value;
      const dateFrom = this.form.get('dateFrom').value;
      if (
        isNotNilOrEmpty(dateTo) &&
        isNotNilOrEmpty(dateFrom) &&
        dateTo < dateFrom
      ) {
        return error;
      } else {
        return null;
      }
    };
  }

  sendFiltro() {
    this.formSubmitted = true;
    if (this.form.valid) {
      this.sendForm.emit(this.form.value);
    }
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
