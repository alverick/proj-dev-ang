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
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { has } from 'ramda';

export interface OptionList {
  name: string;
  code: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  currency: string;
  dataType: string;
}

const INTERVAL_DATE = 0;

export interface FilterFormData {
  services: ServiceItem[];
  payment: string;
  dateFrom: string;
  dateTo: string;
}

interface FilterForm {
  services: FormControl<ServiceItem[]>;
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
  @Output() sendForm = new EventEmitter<object>();
  @Output() resetForm = new EventEmitter();
  @ViewChild('multiselect') multiselect!: any;

  internalDates: any[];
  maxDateTo = new Date();
  minDateTo: Date | null = null;
  maxDateFrom = new Date();
  errorMessages = {
    services: {
      required: 'Elija una opción',
    },
    payment: {
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
    if (has('initialValue', changes) && this.form) {
      this.form.patchValue(this.initialValue, { emitEvent: false });
    }
  }

  ngOnInit() {
    this.internalDates = this.optionsDates;
    this.setForm();
    this.parseDates();
    this.parseServices();
  }

  private setForm() {
    this.maxDateFrom.setDate(this.maxDateTo.getDate() - INTERVAL_DATE);
    this.form = this.fb.nonNullable.group({
      services: this.fb.nonNullable.control([], Validators.required),
      payment: this.fb.control('', Validators.required),
      dateFrom: this.fb.control('', Validators.required),
      dateTo: this.fb.control('', Validators.required),
    });
    console.log('setForm');
    this.form.patchValue(this.initialValue);
  }

  parseLabelServices(value: OptionList[]) {
    return value.length === this.services.length
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
        this.internalDates = showAll
          ? this.optionsDates
          : [this.optionsDates[0]];
        console.log(value, showAll, this.optionsDates, this.internalDates);
      });
  }

  private parseDates() {
    const filterNotValidValues = (value) => {
      return isNotNilOrEmpty(value);
    };

    this.form
      .get('dateFrom')
      .valueChanges.pipe(takeUntil(this.$destroy), filter(filterNotValidValues))
      .subscribe((value: Date) => {
        const dateTo = new Date();
        dateTo.setDate(value.getDate() + INTERVAL_DATE);
        this.minDateTo = dateTo;
        this.form.get('dateTo').setValue(null);
      });
  }

  sendFilters() {
    console.log(this.form.valid, this.form);
    if (this.form.valid) {
      this.sendForm.emit(this.form.value);
    }
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
