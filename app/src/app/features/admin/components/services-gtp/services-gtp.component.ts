import { CurrencyPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  type UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Ripple } from 'primeng/ripple';
import { isNil } from 'ramda';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { currencies } from '../../../../shared/constants/currencies';
import {
  ServiceTypes,
  statusCodes,
} from '../../../../shared/constants/services';
import { type IEntryModel } from '../../../../shared/models';
import { DataServiceGTP } from '../../../../shared/models/data-service-gtp';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { type CompanyAccounts } from '../../../../shared/services/company.service';

@Component({
  selector: 'cs-services-gtp',
  templateUrl: './services-gtp.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextarea,
    RadioButtonModule,
    InputTextModule,
    ButtonDirective,
    Ripple,
    CurrencyPipe,
  ],
})
export class ServicesGTPComponent implements OnInit {
  codDeudor = this.afiliacionService.codDeudor;
  tiposDato = this.afiliacionService.tipoDato;
  tiposPago = this.afiliacionService.tipoPago;
  monedas = currencies;
  tiposMora = this.afiliacionService.periodoMora;
  cuentas: CompanyAccounts[] = [];
  simboloMoneda = 'S/';
  cobraMora = false;
  cmoraporce = false;
  serviceTypeComplete = true;
  inReview: boolean;
  private _service: DataServiceGTP;

  update = false;
  useAgencyChannel = false;

  @Input() public idCompany: number;

  @Input() set service(value: DataServiceGTP) {
    this._service = value;
  }

  @Output() grabar = new EventEmitter<any>();
  submittedRequired = false;
  frm: UntypedFormGroup;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly afiliacionService: AfiliacionService,
  ) {}

  ngOnInit() {
    if (isNil(this._service.res)) {
      this._service.res = '';
    }

    const ResValue =
      this._service.res !== ''
        ? [
            Validators.required,
            Validators.maxLength(7),
            Validators.minLength(7),
            Validators.pattern('^[0-9]*$'),
          ]
        : [Validators.minLength(7)];
    this.inReview = this._service.inReview;
    const montod = this._service.amount ?? '1.00';

    const porcentajed = this._service.porcentage ?? '1.00';
    let nameCode =
      this._service.codDeudor === 'Otro'
        ? this._service.nameCod
        : this._service.codDeudor;
    if (
      this._service.newNameCodeGTPStatus === statusCodes.NEW ||
      this._service.newNameCodeGTPStatus === statusCodes.EDITED
    ) {
      nameCode = this._service.newNameCode;
    }

    this.simboloMoneda = this._service.currencySymbol;

    const processValue = function (value) {
      if (value === null) {
        return '';
      } else if (value === true) {
        return 'S';
      } else {
        return 'N';
      }
    };

    const getValue = (value: string, elements: IEntryModel[]) => {
      return elements.find((item) => item.code === value).name;
    };

    this.frm = this.fb.group({
      nombre: [
        {
          value:
            this._service.newNameGTPStatus !== statusCodes.APPROVED
              ? this._service.newName
              : this._service.name,
          disabled: true,
        },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(
            '^[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñA-Za-zÁÉÍÓÚáéíóú&  ]*$',
          ),
        ],
      ],

      res: [{ value: this._service.res, disabled: true }, ResValue],
      codDeudor: [
        {
          value:
            this._service.debtorCode === 'RUC' ||
            this._service.debtorCode === 'DNI' ||
            this._service.debtorCode === 'Codigo Interno'
              ? this._service.debtorCode
              : 'Otro',
          disabled: true,
        },
        [Validators.required],
      ],
      nameCod: [{ value: nameCode, disabled: true }],
      tipoDato: [
        {
          value: getValue(this._service.dataType, this.tiposDato),
          disabled: true,
        },
        Validators.required,
      ],
      tipoPago: [
        {
          value: getValue(this._service.paymentType, this.tiposPago),
          disabled: true,
        },
        Validators.required,
      ],
      idCuenta: [
        { value: this._service.idAccount, disabled: true },
        Validators.required,
      ],
      moneda: [this._service.currency, Validators.required],
      usaAgente: [
        {
          value: this._service.useAgent,
          disabled: true,
        },
      ],
      usaTienda: [
        {
          value: this._service.useStore,
          disabled: true,
        },
      ],
      usaWebApp: [
        {
          value: this._service.useAppWeb,
          disabled: true,
        },
      ],
      cobraMora: [
        {
          value: this._service.chargeInterest,
          disabled: true,
        },
      ],
      periodoMora: [
        {
          value: getValue(this._service.chargeType.toString(), this.tiposMora),
          disabled: true,
        },
        [Validators.required],
      ],
      tipoMora: { value: this._service.interestType, disabled: true },
      monto: [{ value: montod, disabled: true }],

      porcentaje: [
        {
          value: porcentajed,
          disabled: true,
        },
      ],
      pagoPartes: [
        {
          value: this._service.partialPayment,
          disabled: true,
        },
      ],
      NewNameCod: [
        processValue(this._service.acceptednewNameCode),
        Validators.required,
      ],
      NewName: [
        processValue(this._service.acceptednewName),
        Validators.required,
      ],
    });
    this.afiliacionService.idCompany = this.idCompany;
    this.changeMora(false);
    this.afiliacionService.GetCards().subscribe((d) => {
      this.cuentas = d;
      const account = d.find((item) => item.id === this._service.idAccount);
      this.frm.get('idCuenta').setValue(account?.number);
    });

    if (this.frm.get('cobraMora').value === 'S') {
      this.cmoraporce = true;
    }
    if (this.frm.get('cobraMora').value === 'N') {
      this.frm.get('periodoMora').setValue('');
      this.cmoraporce = false;
    }

    // combo para ocultar si es data parcial
    this.serviceTypeComplete = this._service.dataType === ServiceTypes.complete;

    this.showAgencyChannel(this._service.useAgencyChannel);
  }

  get f(): any {
    return this.frm.controls;
  }

  RadioAprovveName() {
    if (this._service.newNameGTPStatus === 1) {
      return false;
    }
    if (this._service.newNameGTPStatus === 3) {
      return false;
    }
    if (this._service.newNameGTPStatus === 0) {
      return true;
    }
    if (this._service.newNameGTPStatus === 2) {
      return true;
    }
  }

  RadioAprovveNameCod() {
    if (this._service.newNameCodeGTPStatus === 1) {
      return false;
    }
    if (this._service.newNameCodeGTPStatus === 3) {
      return false;
    }
    if (this._service.newNameCodeGTPStatus === 0) {
      return true;
    }
    if (this._service.newNameCodeGTPStatus === 2) {
      return true;
    }
  }

  Button() {
    if (
      this._service.newNameGTPStatus === 1 &&
      this._service.newNameCodeGTPStatus === 1
    ) {
      return false;
    }
    if (
      this._service.newNameGTPStatus === 3 ||
      this._service.newNameCodeGTPStatus === 3
    ) {
      return false;
    }
    if (
      this._service.newNameGTPStatus === 0 ||
      this._service.newNameCodeGTPStatus === 0
    ) {
      return true;
    }
    if (
      this._service.newNameGTPStatus === 2 ||
      this._service.newNameCodeGTPStatus === 2
    ) {
      return true;
    }
  }

  onUpdateRes() {
    this.update = true;
  }

  onSubmitServicio() {
    // NOMBRE DE SERVICIO
    this.submittedRequired = true;
    if (this._service.newNameGTPStatus === 1) {
      this.f.NewName.clearValidators();
      this.f.NewName.reset();
    }
    if (
      this._service.newNameGTPStatus === 3 &&
      this._service.name !== '' &&
      this._service.newName !== ''
    ) {
      this.f.NewName.clearValidators();
      this.f.NewName.reset();
    }
    // CODIGO DEUDOR
    if (this._service.newNameCodeGTPStatus === 1) {
      this.f.NewNameCod.clearValidators();
      this.f.NewNameCod.reset();
    }
    if (
      this._service.newNameCodeGTPStatus === 3 &&
      this._service.debtorCode !== '' &&
      this._service.newNameCode !== ''
    ) {
      this.f.NewNameCod.clearValidators();
      this.f.NewNameCod.reset();
    }
    if (this.frm.valid) {
      const value: DataServiceGTP = this._service;
      value.res = this.frm.getRawValue().res;

      value.acceptednewName =
        this._service.newNameGTPStatus === 1 ||
        (this._service.newNameGTPStatus === 3 &&
          this._service.name !== '' &&
          this._service.newName !== '')
          ? true
          : this.frm.value.NewName === 'S';
      value.acceptednewNameCode =
        this._service.newNameCodeGTPStatus === 1 ||
        (this._service.newNameCodeGTPStatus === 3 &&
          this._service.debtorCode !== '' &&
          this._service.newNameCode !== '')
          ? true
          : this.frm.value.NewNameCod === 'S';

      this.grabar.emit(value);
      this.update = false;
    }
  }

  Codigo(event) {
    if (event === 'Otro') {
      this.f.nameCod.setValidators([
        Validators.required,
        Validators.minLength(3),
      ]);
    } else {
      this.f.nameCod.clearValidators();
      this.f.nameCod.reset();
    }
  }

  changeMora(changeData: boolean = true) {
    this.cobraMora = this.f.cobraMora.value === 'S';
    if (this.cobraMora) {
      this.f.periodoMora.setValidators([Validators.required]);
      this.f.monto.disable();
      this.f.monto.setValidators([
        Validators.required,
        Validators.pattern('^([0-9]{1,4})?(.[0-9]{1,2})?$'),
        Minimo(0.5),
        Maximo(1000),
      ]);
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      if (changeData) {
        this.f.porcentaje.reset('1.00');
      }
    } else {
      this.cmoraporce = false;
      // this.f.periodoMora.setValue('1')
      this.f.periodoMora.reset();
      this.f.periodoMora.clearValidators();
      this.f.periodoMora.updateValueAndValidity();
      this.f.monto.clearValidators();
      this.f.monto.disable();
      if (changeData) {
        this.f.monto.reset('1.00');
      }
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      if (changeData) {
        this.f.porcentaje.reset('1.00');
      }
    }
  }

  showAgencyChannel(show: boolean) {
    this.useAgencyChannel = show;
  }
}

function Maximo(max: number) {
  return (c: UntypedFormControl) => {
    const nro = parseFloat(c.value);
    if (!isNaN(nro)) {
      if (nro > max) {
        return { maximo: true };
      }
    }
    return null;
  };
}

function Minimo(min: number) {
  return (c: UntypedFormControl) => {
    const nro = parseFloat(c.value);
    if (!isNaN(nro)) {
      if (nro < min) {
        return { minimo: true };
      }
    }
    return null;
  };
}
