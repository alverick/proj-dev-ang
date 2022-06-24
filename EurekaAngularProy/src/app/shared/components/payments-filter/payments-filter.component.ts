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
import { forEachObjIndexed, isNil, keys, mapObjIndexed } from 'ramda';
import { isNotNil, isNotNilOrEmpty, isObj } from 'ramda-adjunct';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { Date } from '../../models/date';
import { StatesGtp } from '../../models/states-gtp';
import { WayPay } from '../../models/way-pay';

const errorMessageDates = {
  required: 'Ingrese una fecha',
  invalid: 'Fecha Inválida',
  beforeFrom: 'Fecha Inválida',
  matDatepickerParse: 'Fecha Inválida',
};

const labelNames = {
  fieldNameSearch: 'Nombre o código del cliente',
  fieldState: 'Servicio',
};

const labelNamesGtp = {
  fieldNameSearch: 'Nombre de empresa, RUC o CU',
  fieldState: 'Rubro',
};

@Component({
  selector: 'cs-payments-filter',
  templateUrl: './payments-filter.component.html',
  styleUrls: ['./payments-filter.component.scss'],
})
export class PaymentsFilterComponent implements OnInit, OnDestroy {
  @Input() gtpMode = false;
  @Input() dateList: DateList[];
  @Input() stateTypeList: StatesGtp[];
  @Input() services: any[];
  @Input() stateList: WayPay[] | StatesGtp[];
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
  fieldNameSearch = '';
  fieldState = '';

  private readonly dateValidators = [
    this.validDateValidator(),
    this.validDateOrderValidator(),
  ];

  form = new FormGroup({
    inputSearch: new FormControl(''),
    service: new FormControl(''),
    status: new FormControl(''),
    statusSolicitud: new FormControl(''),
    dateForFilter: new FormControl(''),
    dateFrom: new FormControl({ value: '', disabled: true }),
    dateTo: new FormControl({ value: '', disabled: true }),
  });

  $destroy = new Subject();

  ngOnInit() {
    this.updateValidatorsDates();
    this.parseDates();
    this.listenChangesForm();
    this.setMode();
  }

  private setMode() {
    if (this.gtpMode) {
      this.fieldNameSearch = labelNamesGtp.fieldNameSearch;
      this.fieldState = labelNamesGtp.fieldState;
    } else {
      this.fieldNameSearch = labelNames.fieldNameSearch;
      this.fieldState = labelNames.fieldState;
    }
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
    if (this.gtpMode) {
      this.setDateFields(false, false);
    } else {
      this.form
        .get('dateForFilter')
        .valueChanges.pipe(takeUntil(this.$destroy))
        .subscribe((value) => {
          this.setDateFields(isNil(value));
        });
    }
  }

  private setDateFields(disable: boolean, required: null | boolean = null) {
    const { dateTo, dateFrom } = this.form.controls;
    if (disable) {
      dateFrom.disable();
      dateTo.disable();
    } else {
      dateFrom.enable();
      dateTo.enable();
    }
    const requiredDate = isNil(required) ? !disable : required;

    if (requiredDate) {
      dateFrom.setValidators([Validators.required, ...this.dateValidators]);
      dateTo.setValidators([Validators.required, ...this.dateValidators]);
    } else {
      dateFrom.setValidators(this.dateValidators);
      dateTo.setValidators(this.dateValidators);
    }

    dateFrom.reset();
    dateFrom.setErrors(null);
    dateTo.reset();
    dateTo.setErrors(null);
    dateFrom.updateValueAndValidity();
    dateTo.updateValueAndValidity();
  }

  cleanAllFilters() {
    this.form.reset();
    if (this.gtpMode) {
      this.setDateFields(false, false);
    }
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

  sendFilters() {
    this.formSubmitted = true;
    if (this.form.valid) {
      const formValuesNull = mapObjIndexed(
        (value) => (isNil(value) ? '' : value),
        this.form.value
      );
      const {
        inputSearch,
        service,
        status,
        statusSolicitud,
        dateForFilter,
        dateFrom = '',
        dateTo = '',
      } = formValuesNull;
      let filterData: any = {
        inputSearch,
        status,
        dateFrom,
        dateTo,
      };
      if (this.gtpMode) {
        filterData = {
          ...filterData,
          statusSolicitud,
          BusinessHeading: service,
        };
      } else {
        filterData = {
          ...filterData,
          service,
          dateForFilter,
        };
      }
      this.sendForm.emit(filterData);
    }
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
