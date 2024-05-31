import { CurrencyPipe } from '@angular/common';
import { type OnInit, Component } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Store } from '@ngrx/store';
import { forEachObjIndexed } from 'ramda';
import { isNilOrEmpty, isNotEmpty, isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { ExcelService } from '../../../../../shared/services/excel.service';
import { HomeService } from '../../../../../shared/services/home.service';
import {
  type ActionEventProperties,
  type Metadata,
  AdobeEvent,
  TrackingService,
} from '../../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../../shared/utils/helpers/popups';
import { companyFeature } from '../../../../../store/reducers/company.reducer';

const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'cs-debt-form',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    CurrencyPipe,
  ],
})

// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DebtComponent implements OnInit {
  isNewFlow = false;

  constructor(
    private dialogRef: MatDialogRef<DebtComponent>,
    private homeService: HomeService,
    public excelService: ExcelService,
    private tracking: TrackingService,
    private store: Store,
    private currencyPipe: CurrencyPipe
  ) {}

  public grabado = false;
  public services: any[];
  public minDate = new Date(2000, 0, 1);
  public maxDate = new Date(2050, 0, 1);
  public isPartial = false;
  public nuevaDeuda: any = {
    errores: {},
  };
  limitAmountMax = 0;
  debtorCodeChanged = new Subject<boolean>();
  loaderDebtorCode = false;
  notAlphanumericRegex = /^[0-9a-zA-Z]+$/;

  ngOnInit(): void {
    this.nuevaDeuda.service = this.excelService.service.name;
    this.isPartial = this.excelService.service.dataType === 'P';
    this.homeService.getServicesActive().subscribe((d) => (this.services = d));
    this.store
      .select(companyFeature.selectCurrencyLimits)
      .pipe(filter((data) => isNotNilOrEmpty(data)))
      .subscribe((limits) => {
        this.limitAmountMax = limits.find(
          (limit) => limit.symbol === this.excelService.service.currencySymbol
        ).limitMax;
      });
    this.store
      .select(companyFeature.selectDetails)
      .pipe(filter((data) => isNotNilOrEmpty(data)))
      .subscribe((details) => {
        this.isNewFlow = details.isNewFlow;
      });

    this.debtorCodeChanged.pipe(debounceTime(600)).subscribe(() => {
      this.buscarNewCode();
    });
  }

  MontoBlur(e: any) {
    const initialValue = parseFloat(e.amount);
    if (!isNaN(initialValue)) {
      e.amount = initialValue.toFixed(2);
    }
  }

  cmbNewService() {
    delete this.nuevaDeuda.errores.service;
    const svc = this.services.find((s) => s.name === this.nuevaDeuda.service);
    this.isPartial = svc.dataType === 'P';
  }

  buscarNewCode() {
    this.nuevaDeuda.errores.code = '';

    if (
      this.nuevaDeuda.service === null ||
      this.nuevaDeuda.service === undefined
    ) {
      this.nuevaDeuda.errores.service = 'Debe escoger un servicio';
      delete this.nuevaDeuda.code;
      return;
    }

    if (
      isNilOrEmpty(this.nuevaDeuda.code) ||
      !this.notAlphanumericRegex.test(this.nuevaDeuda.code)
    ) {
      return;
    }

    const initTime = new Date();

    this.loaderDebtorCode = true;

    this.homeService
      .getDebtorCode(this.nuevaDeuda.service, this.nuevaDeuda.code)
      .subscribe((d) => {
        const endTime = new Date();
        const delay = 900 - (endTime.getTime() - initTime.getTime());
        setTimeout(() => {
          this.loaderDebtorCode = false;
        }, delay);
        if (d.id) {
          this.nuevaDeuda.firstName = d.firstName;
          delete this.nuevaDeuda.errores.firstName;
        }
      });
  }

  grabarNuevo() {
    console.log(this.nuevaDeuda.errores);
    this.nuevaDeuda.errores = {};
    if (!this.nuevaDeuda.service) {
      this.nuevaDeuda.errores.service = 'Debe escoger un servicio';
    }

    const emidate = new Date(this.nuevaDeuda.emissionDate).getFullYear();
    if (!this.nuevaDeuda.emissionDate || emidate < 2000 || emidate > 2050) {
      this.nuevaDeuda.errores.emissionDate = 'Fecha Inválida';
    }

    if (!this.isPartial) {
      this.validateCompleteData();
    }

    this.validateCode();

    if (this.nuevaDeuda.firstName) {
      const re = /^[ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]+$/;
      if (this.nuevaDeuda.firstName.length < 3) {
        this.nuevaDeuda.errores.firstName =
          'Debe tener 3 carácteres como mínimo';
      } else if (!re.test(this.nuevaDeuda.firstName)) {
        this.nuevaDeuda.errores.firstName = 'No cumple con el formato';
      }
    } else {
      this.nuevaDeuda.errores.firstName = 'Debe ingresar un valor';
    }

    if (isNotEmpty(this.nuevaDeuda.errores)) {
      return;
    }

    const debt = this.isPartial
      ? {
          emissionDate: this.nuevaDeuda.emissionDate,
          code: this.nuevaDeuda.code,
          firstName: this.nuevaDeuda.firstName,
        }
      : {
          emissionDate: this.nuevaDeuda.emissionDate,
          dueDate: this.nuevaDeuda.dueDate,
          code: this.nuevaDeuda.code,
          firstName: this.nuevaDeuda.firstName,
          concept: this.nuevaDeuda.concept,
          amount: this.nuevaDeuda.amount,
        };
    this.homeService
      .postNewDebt(this.nuevaDeuda.service, debt)
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
            category: 'Agregar Cobro',
            action: 'modal-view',
            detail: 'Se ha agregado el cobro. ¿Que desea hacer?',
            location: 'Modal',
          });
          void swalAlert
            .fire({
              title: 'Agregar Cobro',
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
                this.nuevaDeuda = {
                  service: this.excelService.service.name,
                  errores: {},
                };
              } else {
                this.dialogRef.close({ grabado: this.grabado });
              }
            });
        } else {
          void swalAlert.fire({
            title: 'Agregar Cobro',
            html: r.message,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Cerrar',
          });
        }
      });
  }

  private validateCode() {
    if (this.nuevaDeuda.code) {
      if (this.nuevaDeuda.code.length < 1) {
        this.nuevaDeuda.errores.code = 'Debe tener 1 carácter como mínimo';
      } else if (!this.notAlphanumericRegex.test(this.nuevaDeuda.code)) {
        this.nuevaDeuda.errores.code = 'No cumple con el formato';
      }
    } else if (!this.nuevaDeuda.code) {
      this.nuevaDeuda.errores.code = 'Debe ingresar un valor';
    }
  }

  private validateCompleteData() {
    const dueyear = new Date(this.nuevaDeuda.dueDate).getFullYear();
    if (!this.nuevaDeuda.dueDate || dueyear < 2000 || dueyear > 2050) {
      this.nuevaDeuda.errores.dueDate = 'Fecha Inválida';
    } else if (
      this.nuevaDeuda.emissionDate &&
      this.nuevaDeuda.dueDate < this.nuevaDeuda.emissionDate
    ) {
      this.nuevaDeuda.errores.dueDate =
        'No debe ser menor a la fecha de emisión';
    }

    if (this.nuevaDeuda.concept) {
      const re = /^[ 0-9a-zA-Z]+$/;
      if (this.nuevaDeuda.concept.length < 2) {
        this.nuevaDeuda.errores.concept = 'Debe tener 2 carácteres como mínimo';
      } else if (!re.test(this.nuevaDeuda.concept)) {
        this.nuevaDeuda.errores.concept = 'No cumple con el formato';
      }
    } else if (!this.nuevaDeuda.concept) {
      this.nuevaDeuda.errores.concept = 'Debe ingresar un valor';
    }

    const amount = parseFloat(this.nuevaDeuda.amount);
    if (!amount) {
      this.nuevaDeuda.errores.amount = 'Debe ingresar un valor';
    } else if (amount < 0) {
      this.nuevaDeuda.errores.amount = 'Ingrese un monto válido';
    } else if (amount > this.limitAmountMax && this.isNewFlow) {
      const amountWithSymbol = this.currencyPipe.transform(
        this.limitAmountMax,
        this.excelService.service.currencySymbol
      );
      this.nuevaDeuda.errores.amount = `Monto máximo ${amountWithSymbol}`;
    }
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
}
