import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { has, path, pipe, pluck, uniq } from 'ramda';
import { isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { currencies, Currency } from '../../../../shared/constants/currencies';

export interface OptionList {
  name: string;
  code: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  currency: string;
  currencySymbol: string;
  dataType: string;
}

export interface FilterFormData {
  services: ServiceItem[];
  currency?: Currency;
  payment: string;
  dateFrom: string;
  dateTo: string;
}

interface FilterForm {
  services: FormControl<ServiceItem[]>;
  currency: FormControl<Currency>;
  payment: FormControl<string>;
  dateFrom: FormControl<string>;
  dateTo: FormControl<string>;
}

/**
 * Filter component for dashboard
 */
@Component({
  selector: 'cs-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class DashboardFilterComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Gtp mode for component
   */
  @Input() services: ServiceItem[];
  @Input() optionsDates: any[];
  @Input() initialValue: FilterFormData;
  @Input() currency: string;
  @Output() currencyChange = new EventEmitter<string>();
  @Output() sendForm = new EventEmitter<object>();
  @Output() sendEmail = new EventEmitter();
  @ViewChild('multiselect') multiselect!: any;

  internalDates: any[];
  internalServices: ServiceItem[] = [];
  currencies = currencies;
  minDateTo: Date | string | null = null;
  showCurrency = false;
  errorMessages = {
    services: {
      required: 'Elija una opción',
    },
    payment: {
      required: 'Elija una opción',
    },
    currency: {
      required: 'Elija una opción',
    },
    dateFrom: {
      required: 'Ingrese una fecha',
      invalid: 'Fecha Inválida',
      beforeFrom: 'Fecha Inválida',
    },
    dateTo: {
      required: 'Ingrese una fecha',
      invalid: 'Fecha Inválida',
      beforeFrom: 'Fecha Inválida',
      matDatepickerParse: 'Fecha Inválida',
    },
  };

  $destroy = new Subject();
  form: FormGroup<FilterForm>;

  constructor(protected fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (isNotNil(path(['services', 'currentValue'], changes))) {
      const selCurrencies = pipe(pluck('currency'), uniq)(this.services);
      this.showCurrency = selCurrencies.length > 1;
      this.internalServices =
        selCurrencies.length > 1
          ? this.services.filter((item) => item.currency === currencies[0].code)
          : this.services;
      this.currencyChange.emit(currencies[0].code);
      this.form.patchValue({
        currency: currencies[0],
        services: this.internalServices,
      });
    }
    if (has('initialValue', changes) && this.form) {
      this.form.patchValue(this.initialValue, { emitEvent: false });
    }
  }

  ngOnInit() {
    this.internalDates = this.optionsDates;
    this.setForm();
    this.parseDates();
    this.parseServices();
    this.form.get('currency').valueChanges.subscribe((value) => {
      this.form.patchValue({ services: [] });
      this.internalServices = this.services.filter(
        (item) => item.currency === value.code
      );
    });
  }

  private setForm() {
    this.form = this.fb.nonNullable.group({
      services: this.fb.nonNullable.control([], Validators.required),
      currency: this.fb.control(null, Validators.required),
      payment: this.fb.control('', Validators.required),
      dateFrom: this.fb.control('', Validators.required),
      dateTo: this.fb.control('', Validators.required),
    });

    this.form.patchValue(this.initialValue);
    this.form.patchValue({
      currency: currencies[0],
      services: this.internalServices,
    });
  }

  parseLabelServices(value: OptionList[]) {
    return value.length === this.internalServices.length
      ? 'Todos los servicios'
      : value
          .map((item) => item.name)
          .sort()
          .join(', ');
  }

  private parseServices(): void {
    this.form
      .get('services')
      .valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        const showAll =
          value.some(({ dataType }) => dataType === 'C') && value.length > 0;
        const optionsDatesSel =
          value.some(({ dataType }) => dataType === 'P') && value.length > 0
            ? [this.optionsDates[0], this.optionsDates[1]]
            : [this.optionsDates[0]];
        this.internalDates = showAll ? this.optionsDates : optionsDatesSel;
      });
  }

  private parseDates() {
    const filterNotValidValues = (value) => {
      return isNotNilOrEmpty(value);
    };

    this.form
      .get('dateFrom')
      .valueChanges.pipe(takeUntil(this.$destroy), filter(filterNotValidValues))
      .subscribe((value: string) => {
        this.minDateTo = value;
        if (this.form.get('dateTo').value < value) {
          this.form.get('dateTo').setValue(null);
        }
      });
  }

  sendFilters() {
    if (this.form.valid) {
      this.currencyChange.emit(this.form.value.currency.code);
      this.sendForm.emit(this.form.value);
    }
  }

  send() {
    this.sendEmail.emit();
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
