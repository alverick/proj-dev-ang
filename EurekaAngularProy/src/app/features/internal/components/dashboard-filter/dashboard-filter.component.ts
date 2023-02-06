import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs/internal/Subject';
import { filter, takeUntil } from 'rxjs/operators';

export interface OptionList {
  name: string;
  code: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  currency: string;
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
export class DashboardFilterComponent implements OnInit, OnDestroy {
  /**
   * Gtp mode for component
   */
  @Input() services: ServiceItem[];
  @Input() optionsDates: ServiceItem[];
  @Input() initialValue: FilterFormData;
  @Output() sendForm = new EventEmitter<object>();
  @Output() resetForm = new EventEmitter();
  @ViewChild('multiselect') multiselect!: any;

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

  ngOnInit() {
    this.setForm();
    this.parseDates();
  }

  private setForm() {
    this.maxDateFrom.setDate(this.maxDateTo.getDate() - INTERVAL_DATE);
    this.form = this.fb.nonNullable.group({
      services: this.fb.nonNullable.control([], Validators.required),
      payment: this.fb.control('', Validators.required),
      dateFrom: this.fb.control('', Validators.required),
      dateTo: this.fb.control('', Validators.required),
    });
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
