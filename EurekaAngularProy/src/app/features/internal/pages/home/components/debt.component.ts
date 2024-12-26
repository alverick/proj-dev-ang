import { CurrencyPipe } from '@angular/common';
import { Component, type OnInit, signal, viewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormModel } from 'ngx-mf';
import { ButtonDirective } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { Ripple } from 'primeng/ripple';
import { forEachObjIndexed, isNil, pathOr } from 'ramda';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { LabelControlComponent } from '../../../../../shared/components/label-control/label-control.component';
import type { CurrencyWithLimit } from '../../../../../shared/constants/currencies';
import { MessageAlertComponent } from '../../../../../shared/components/message-alert/message-alert.component';
import { messageModes } from '../../../../../shared/constants/messages';
import { ServiceTypes } from '../../../../../shared/constants/services';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { HomeService } from '../../../../../shared/services/home.service';
import {
  type ActionEventProperties,
  AdobeEvent,
  type Metadata,
  TrackingService,
} from '../../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../../shared/utils/helpers/popups';

interface Debt {
  emissionDate: string;
  dueDate: string;
  code: string;
  firstName: string;
  concept: string;
  amount: number;
}

@Component({
  selector: 'cs-debt-form',
  templateUrl: './debt.component.html',
  providers: [CurrencyPipe],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    CalendarModule,
    InputTextModule,
    KeyFilterModule,
    InputNumberModule,
    ButtonDirective,
    Ripple,
    IconFieldModule,
    InputIconModule,
    MessageAlertComponent,
  ],
})
export class DebtComponent implements OnInit {
  useAmountLimits = false;
  public grabado = false;
  public minDate = new Date(2000, 0, 1);
  public maxDate = new Date(2049, 11, 31);
  public isPartial = false;
  limitAmountMax: number = null;
  messageModes = messageModes;
  debtorExistent = signal(false);
  loaderDebtorCode = false;
  alphaNumSpaceRegex = /^[ 0-9a-zA-Z]+$/;
  validNameRegex = /^[ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]+$/;
  amountWithSymbolLabel = '';
  debtForm: FormModel<Debt> = this.fb.group({
    emissionDate: ['', Validators.required, this.limitYearValidator()],
    dueDate: ['', Validators.required],
    code: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('[\\w]*'),
      ],
    ],
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(this.validNameRegex),
      ],
    ],
    concept: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(this.alphaNumSpaceRegex),
      ],
    ],
    amount: [null as number, Validators.required],
  });

  formErrors: Record<string, Record<string, string>> = {
    emissionDate: {
      required: 'Debe ingresar un valor',
      notValid: 'Fecha inválida',
      limitYear: 'Fecha inválida',
    },
    dueDate: {
      required: 'Debe ingresar un valor',
      notValid: 'Fecha inválida',
      limitYear: 'Fecha inválida',
    },
    code: {
      required: 'Debe ingresar un valor',
      minlength: 'Debe tener 1 carácter como mínimo',
      pattern: 'No cumple con el formato',
    },
    firstName: {
      required: 'Debe ingresar un valor',
      pattern: 'No cumple con el formato',
      minlength: 'Debe tener 3 carácteres como mínimo',
    },
    concept: {
      required: 'Debe ingresar un valor',
    },
    amount: { required: 'Debe ingresar un valor' },
  };
  formDirective = viewChild<FormGroupDirective>('formDirective');

  constructor(
    public dialogRef: DynamicDialogRef<DebtComponent>,
    private readonly homeService: HomeService,
    public excelService: ExcelService,
    private readonly tracking: TrackingService,
    public config: DynamicDialogConfig,
    private readonly currencyPipe: CurrencyPipe,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.setPartialMode();

    this.useAmountLimits = pathOr(
      false,
      ['data', 'useAmountLimits'],
      this.config,
    );

    if (this.useAmountLimits) {
      this.limitAmountMax = (
        pathOr([], ['data', 'amountLimits'], this.config) as CurrencyWithLimit[]
      ).find(
        (limit) => limit.symbol === this.excelService.service.currencySymbol,
      )?.limitMax;
      const amountWithSymbol = this.currencyPipe.transform(
        this.limitAmountMax,
        this.excelService.service.currencySymbol,
      );
      this.amountWithSymbolLabel = 'Monto máximo ' + amountWithSymbol;
    }

    this.debtForm.controls.code.valueChanges
      .pipe(debounceTime(600))
      .subscribe(() => {
        this.debtorExistent.set(false);
        this.debtForm.controls.firstName.reset();
        this.debtForm.controls.firstName.enable();
        this.buscarNewCode();
      });
  }

  setPartialMode() {
    this.isPartial =
      this.excelService.service.dataType === ServiceTypes.partial;
    if (this.isPartial) {
      this.debtForm.controls.dueDate.disable();
      this.debtForm.controls.concept.disable();
      this.debtForm.controls.amount.disable();
    }
  }

  buscarNewCode() {
    if (!this.debtForm.controls.code.valid) {
      return;
    }

    const initTime = new Date();

    this.loaderDebtorCode = true;

    this.homeService
      .getDebtorCode(
        this.excelService.service.name,
        this.debtForm.controls.code.value,
      )
      .subscribe((d) => {
        const endTime = new Date();
        const delay = 900 - (endTime.getTime() - initTime.getTime());
        setTimeout(() => {
          this.loaderDebtorCode = false;
        }, delay);
        if (d.id) {
          this.debtForm.controls.firstName.setValue(d.firstName);
          this.loaderDebtorCode = false;
          this.debtForm.controls.firstName.disable();
          this.debtorExistent.set(true);
        }
      });
  }

  resetName() {
    this.debtForm.controls.firstName.setValue('');
    this.debtForm.controls.code.setValue('');
    this.loaderDebtorCode = false;
    this.debtForm.controls.firstName.enable();
    this.debtorExistent.set(false);
  }

  grabarNuevo() {
    if (!this.debtForm.valid) {
      return;
    }

    const { emissionDate, code, firstName, dueDate, concept, amount } =
      this.debtForm.getRawValue();

    const debt = this.isPartial
      ? {
          emissionDate,
          code,
          firstName,
        }
      : {
          emissionDate,
          dueDate,
          code,
          firstName,
          concept,
          amount,
        };

    this.homeService
      .postNewDebt(this.excelService.service.name, debt)
      .subscribe((r) => {
        const metadata: Metadata[] = [];
        forEachObjIndexed((value, key) => {
          metadata.push({
            key: key as string,
            value: value as string,
          });
        }, debt);
        const actionStep: Partial<ActionEventProperties> = {
          category: 'Home movimientos',
          action: 'Click',
          label: 'Grabar',
          location: 'Modal agregar cobro',
          step: 'Not available',
          state: 'Envío exitoso',
          metadata,
        };

        if (r.success) {
          this.tracking.trackEvent(AdobeEvent.trackFormSubmit, actionStep);
          this.grabado = true;
          this.tracking.trackEvent(AdobeEvent.trackView, {
            category: 'Agregar cobro',
            action: 'modal-view',
            detail: 'Se ha agregado el cobro. ¿Que desea hacer?',
            location: 'Modal',
          });
          void swalAlert
            .fire({
              title: 'Agregar cobro',
              html: 'Se ha agregado el cobro.<br />¿Que desea hacer?',
              showCancelButton: true,
              showCloseButton: true,
              confirmButtonText: 'Agrega otro',
              cancelButtonText: 'Cerrar',
            })
            .then((result) => {
              this.tracking.trackEvent(AdobeEvent.trackAction, {
                category: 'Home movimientos',
                action: 'Click',
                detail: result.value ? 'Agregar otro cobro' : 'Cerrar modal',
                label: result.value ? 'Agrega otro' : 'Cerrar',
                typeElement: 'Botón',
                location: 'Modal agregar cobro',
              });
              if (result.value) {
                this.formDirective().resetForm();
                this.debtForm.reset();
              } else {
                this.dialogRef.close({ grabado: this.grabado });
              }
            });
        } else {
          void swalAlert.fire({
            title: 'Ha ocurrido un error',
            html: r.message,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Cerrar',
          });
        }
      });
  }

  cerrarDialog() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Cerrar modal',
      label: 'Cerrar',
      typeElement: 'Botón',
      location: 'Modal agregar cobro',
    });
    this.dialogRef.close({ grabado: this.grabado });
  }

  limitYearValidator(minYear = 2000, maxYear = 2050) {
    return (control: AbstractControl<Date>): ValidationErrors | null => {
      const limitYear =
        isNil(control.value) ||
        control.value.getFullYear() < minYear ||
        control.value.getFullYear() > maxYear;
      return limitYear ? of({ limitYear: { value: control.value } }) : of(null);
    };
  }
}
