import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MonedaModel } from 'src/app/shared/models';
import { DataServiceGTP } from 'src/app/shared/models/data-service-gtp';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { GtpService } from 'src/app/shared/services/gtp.service';

@Component({
  selector: 'cs-services-gtp',
  templateUrl: './services-gtp.component.html',
  styleUrls: ['./services-gtp.component.scss'],
})
export class ServicesGTPComponent implements OnInit {
  codDeudor: any[] = [];
  tiposDato: any[] = [];
  tiposPago: any[] = [];
  monedas: MonedaModel[] = [];
  tiposMora: any[] = [];
  cuentas: any[] = [];
  simboloMoneda = 'S/';
  cobraMora = false;
  cobraMonto = true;
  cobraPorcentaje = false;
  cmoraporce = false;
  Dataparcial = true;
  inReview: boolean;
  private _service: DataServiceGTP;
  configEmpresaService: any;
  private _tc = 3.37;

  update = false;
  public comAgente = 1.5;
  public comTienda = 7;
  useAgencyChannel = false;

  @Input() public idCompany: number;
  @Input() set service(value: DataServiceGTP) {
    this._service = value;
  }

  /*
    @Input() set service(value: ServiceModel) {
         this._service = value;
         this.simboloMoneda = value.simboloMoneda;
         this._service.simboloMoneda = this.simboloMoneda;
     }
   */

  @Output() grabar = new EventEmitter<any>();
  submittedRequired = false;
  constructor(
    private fb: UntypedFormBuilder,
    private afiliacionService: AfiliacionService,
    public gtpService: GtpService
  ) {
    afiliacionService.GetTipoCambio().subscribe((t) => (this._tc = t));
  }

  frm: UntypedFormGroup;
  ngOnInit() {
    let ResValue = [];
    this._service.res =
      this._service.res == '' || this._service.res == null
        ? ''
        : this._service.res;

    if (this._service.res != '') {
      ResValue = [
        Validators.required,
        Validators.maxLength(7),
        Validators.minLength(7),
        Validators.pattern('^[0-9]*$'),
      ];
    } else {
      ResValue = [Validators.minLength(7)];
    }
    this.inReview = this._service.inReview;
    var montod =
      this._service.amount !== null && this._service.amount !== undefined
        ? this._service.amount
        : '1.00';
    var porcentajed =
      this._service.porcentage !== null &&
      this._service.porcentage !== undefined
        ? this._service.porcentage
        : '1.00';
    var nameCode =
      this._service.codDeudor === 'Otro'
        ? this._service.nameCod
        : this._service.codDeudor;
    if (
      this._service.newNameCodeGTPStatus === 0 ||
      this._service.newNameCodeGTPStatus === 2
    )
      nameCode = this._service.newNameCode;
    this.frm = this.fb.group({
      nombre: new UntypedFormControl(
        {
          value:
            this._service.newNameGTPStatus === 0 ||
            this._service.newNameGTPStatus === 2 ||
            this._service.newNameGTPStatus === 3
              ? this._service.newName
              : this._service.name,
          disabled: true,
        },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(
            '^[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñA-Za-zÁÉÍÓÚáéíóú&  ]*$'
          ),
        ]
      ),
      /*  nombre: new FormControl({ value:  (this._service.name === '?') ?
        ( ((this._service.newName.substring(0, 3) === '???')?
        (this._service.newName.substring(3, this._service.newName.length)):this._service.newName)):((this._service.name === this._service.newName)? this._service.name : this._service.newName ) , disabled: true },
          [Validators.required, Validators.minLength(3),
          Validators.pattern('^[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñA-Za-zÁÉÍÓÚáéíóú&  ]*$')]), */

      res: new UntypedFormControl(
        { value: this._service.res, disabled: false },
        ResValue
      ),
      codDeudor: new UntypedFormControl(
        {
          value:
            this._service.debtorCode === 'RUC' ||
            this._service.debtorCode === 'DNI' ||
            this._service.debtorCode === 'Codigo Interno'
              ? this._service.debtorCode
              : 'Otro',
          disabled: true,
        },
        [Validators.required]
      ),

      // tslint:disable-next-line:max-line-length
      // nameCods: new FormControl ({ value: ( this._service.newNameCodeGtpStatus === 0  || this._service.newNameCodeGtpStatus === 2 })? this._service.newNameCode : this._service.debtorCode     , disabled: true}),

      /*  nameCod: new FormControl({ value: (this._service.debtorCode === '?')?
        (( (this._service.newNameCode.substring(0,3) === '???')?
        (this._service.newNameCode.substring(3, this._service.newNameCode.length)): this._service.newNameCode)) : (this._service.debtorCode === this._service.newNameCode)? this._service.debtorCode :this._service.newNameCode , disabled: true}), */
      nameCod: new UntypedFormControl({ value: nameCode, disabled: true }),
      tipoDato: new UntypedFormControl(
        { value: this._service.dataType, disabled: true },
        Validators.required
      ),
      tipoPago: new UntypedFormControl(
        { value: this._service.paymentType, disabled: true },
        Validators.required
      ),
      idCuenta: new UntypedFormControl(
        { value: this._service.idAccount, disabled: true },
        Validators.required
      ),
      moneda: [this._service.currency, Validators.required],
      usaAgente: new UntypedFormControl({
        value: this._service.useAgent,
        disabled: true,
      }),
      usaTienda: new UntypedFormControl({
        value: this._service.useStore,
        disabled: true,
      }),
      usaWebApp: new UntypedFormControl({
        value: this._service.useAppWeb,
        disabled: true,
      }),
      cobraMora: new UntypedFormControl({
        value: this._service.chargeInterest,
        disabled: true,
      }),
      periodoMora: new UntypedFormControl(
        { value: this._service.chargeType, disabled: true },
        [Validators.required]
      ),
      tipoMora: { value: this._service.interestType, disabled: true },
      // montoRadioButton: new FormControl({ value: montod, disabled: true }),
      monto: new UntypedFormControl({ value: montod, disabled: true }),

      porcentaje: new UntypedFormControl({ value: porcentajed, disabled: true }),
      pagoPartes: new UntypedFormControl({
        value: this._service.partialPayment,
        disabled: true,
      }),
      // tslint:disable-next-line:max-line-length
      NewNameCod: [
        this._service.acceptednewNameCode === null
          ? ''
          : this._service.acceptednewNameCode === true
          ? 'S'
          : 'N',
        Validators.required,
      ],
      // tslint:disable-next-line:max-line-length
      NewName: [
        this._service.acceptednewName === null
          ? ''
          : this._service.acceptednewName === true
          ? 'S'
          : 'N',
        Validators.required,
      ],
    });
    this.afiliacionService.idCompany = this.idCompany;
    this.changeMora(false);
    this.afiliacionService
      .GetCodDeudor()
      .subscribe((d) => (this.codDeudor = d));
    this.afiliacionService.GetTipoDato().subscribe((d) => (this.tiposDato = d));
    this.afiliacionService.GetTipoPago().subscribe((d) => (this.tiposPago = d));
    this.afiliacionService.GetMoneda().subscribe((d) => (this.monedas = d));
    this.afiliacionService
      .GetPeriodoMora()
      .subscribe((d) => (this.tiposMora = d));
    this.afiliacionService.GetCards().subscribe((d) => {
      this.cuentas = d;
      this.frm.get('idCuenta').setValue(this._service.idAccount);
    });

    if (this.frm.get('cobraMora').value === 'S') {
      this.cmoraporce = true;
    }
    if (this.frm.get('cobraMora').value === 'N') {
      this.frm.get('periodoMora').setValue('');
      this.cmoraporce = false;
    }

    // combo para ocultar si es data parcial
    if (
      this.frm.get('tipoDato').value === 'P' ||
      this.frm.get('tipoDato').value === 'S'
    ) {
      /* this.frm.get('tipoPago').setValue('C');
      this.tiposPago.pop();*/
      this.Dataparcial = false;
    } else {
      this.Dataparcial = true;
    }

    this.showAgencyChannel(this._service.useAgencyChannel);
  }

  get f(): any {
    return this.frm.controls;
  }

  RadioAprovveName2() {
    if (this._service.name === this._service.newName) {
      return false;
    }
    if (
      this._service.name === '?' &&
      this._service.newName.substring(0, 3) === '???'
    ) {
      return false;
    }
    if (this._service.name === '?') {
      return true;
    }

    if (this._service.name !== this._service.newName) {
      return true;
    }
    if (
      this._service.inReview &&
      this._service.name === '?' &&
      this._service.newName.substring(0, 3) !== '???'
    ) {
      return true;
    }
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

  RadioAprovveNameCod2() {
    if (this._service.debtorCode === this._service.newNameCode) {
      return false;
    }
    if (
      this._service.debtorCode === '?' &&
      this._service.newNameCode.substring(0, 3) === '???'
    ) {
      return false;
    }
    if (this._service.debtorCode === '?') {
      return true;
    }
    if (this._service.debtorCode !== this._service.newNameCode) {
      return true;
    }
    if (
      this._service.inReview &&
      this._service.debtorCode === '?' &&
      this._service.newNameCode.substring(0, 3) !== '???'
    ) {
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
  Button2() {
    if (
      this._service.name === this._service.newName &&
      this._service.debtorCode === this._service.newNameCode
    ) {
      return false;
    }
    if (
      (this._service.name === '?' &&
        this._service.newName.substring(0, 3) === '???') ||
      (this._service.debtorCode === '?' &&
        this._service.newNameCode.substring(0, 3) === '???')
    ) {
      return false;
    }
    if (this._service.name === '?' || this._service.debtorCode === '?') {
      return true;
    }
    if (
      this._service.name !== this._service.newName ||
      this._service.debtorCode !== this._service.newNameCode
    ) {
      return true;
    }
    if (
      (this._service.inReview &&
        this._service.name === '?' &&
        this._service.newName.substring(0, 3) !== '???') ||
      (this._service.inReview &&
        this._service.debtorCode === '?' &&
        this._service.newNameCode.substring(0, 3) !== '???')
    ) {
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
      let value: DataServiceGTP;
      value = this._service;
      value.res = this.frm.value.res;
      // value.acceptednewName = (this.frm.value.NewName === 'S');
      // value.acceptednewNameCode = (this.frm.value.NewNameCod === 'S') ;
      // tslint:disable-next-line:max-line-length
      //  value.acceptednewName = (this._service.name  !== this._service.newName) ? ((this.frm.value.NewName === 'S') ? true : false) : true;
      // tslint:disable-next-line:max-line-length
      value.acceptednewName =
        this._service.newNameGTPStatus === 1 ||
        (this._service.newNameGTPStatus === 3 &&
          this._service.name !== '' &&
          this._service.newName !== '')
          ? true
          : this.frm.value.NewName === 'S'
          ? true
          : false;
      // tslint:disable-next-line:max-line-length
      //  value.acceptednewNameCode = (this._service.debtorCode !== this._service.newNameCode ) ? ( (this.frm.value.NewNameCod === 'S') ? true : false) : true ;
      // tslint:disable-next-line:max-line-length
      value.acceptednewNameCode =
        this._service.newNameCodeGTPStatus === 1 ||
        (this._service.newNameCodeGTPStatus === 3 &&
          this._service.debtorCode !== '' &&
          this._service.newNameCode !== '')
          ? true
          : this.frm.value.NewNameCod === 'S'
          ? true
          : false;

      this.grabar.emit(value);
      this.update = false;
    }
  }

  /*
      newName         name
    minimarket         ''       NUEVO     0  -
      ''            minimarket  APROBADO  1
      sm            minimarket  EDITADO   2  -
      sm            minimarket  RECHAZADO 3
      ''               sm       APROBADO  1
  */
  onSubmitServicio2() {
    // NOMBRE DE SERVICIO
    if (this._service.newNameGTPStatus === 1) {
      this.f.NewName.clearValidators();
      this.f.NewName.reset();
    }
    if (this._service.newNameGTPStatus === 3) {
      this.f.NewName.clearValidators();
      this.f.NewName.reset();
    }
    // CODIGO DEUDOR
    if (this._service.newNameCodeGTPStatus === 1) {
      this.f.NewNameCod.clearValidators();
      this.f.NewNameCod.reset();
    }
    if (this._service.newNameCodeGTPStatus === 3) {
      this.f.NewNameCod.clearValidators();
      this.f.NewNameCod.reset();
    }

    if (this.frm.valid) {
      let value: DataServiceGTP;
      value = this._service;

      // value.acceptednewName = (this.frm.value.NewName === 'S');
      // value.acceptednewNameCode = (this.frm.value.NewNameCod === 'S') ;
      // tslint:disable-next-line:max-line-length
      value.acceptednewName =
        this._service.name !== this._service.newName
          ? this.frm.value.NewName === 'S'
            ? true
            : false
          : true;
      // tslint:disable-next-line:max-line-length
      value.acceptednewNameCode =
        this._service.debtorCode !== this._service.newNameCode
          ? this.frm.value.NewNameCod === 'S'
            ? true
            : false
          : true;
      this.grabar.emit(value);
    }
  }

  onChangeTipoDato() {
    if (this.frm.get('tipoDato').value === 'P') {
      /* this.frm.get('tipoPago').setValue('C');
       this.tiposPago.pop();*/
      this.Dataparcial = false;
      // cobraMora
      this.frm.get('cobraMora').setValue('N');
      this.frm.get('pagoPartes').setValue('N');

      this.frm.get('monto').setValue('1.00');
      this.frm.get('porcentaje').setValue('1.00');
      this.cmoraporce = false;
      this.cobraMora = false;
    } else {
      this.Dataparcial = true;
    }
    /* else if (this.tiposPago.length === 1) {
       this.tiposPago.push({
         code: 'P',
         name: "Siempre la deuda que vence primero"
       });
     }  */
  }

  changeCuenta(val) {
    const cta = this.cuentas.find((c) => c.id === val);
    this.simboloMoneda = cta.currency === '001' ? 'S/' : '$';
    this.f.moneda.setValue(cta.currency);
    if (this.f.moneda.value !== '001') {
      this.comAgente = Math.round((1.5 / this._tc) * 100) / 100;
      this.comTienda = Math.round((7 / this._tc) * 100) / 100;
    } else {
      this.comAgente = 1.5;
      this.comTienda = 7;
    }
  }

  TipoCobro() {
    this.frm.get('tipoMora').setValue('M');
    this.cobraMonto = true;
    this.cobraPorcentaje = false;
    if (
      this.frm.get('periodoMora').value === '1' ||
      this.frm.get('periodoMora').value === '2'
    ) {
      this.cmoraporce = true;
      this.f.monto.clearValidators();
      this.f.monto.enable();
      this.f.monto.setValidators([
        Validators.required,
        Validators.pattern('^([0-9]{1,4})?(.[0-9]{1,2})?$'),
        Minimo(0.5),
        Maximo(1000),
      ]);
      this.f.monto.reset('1.00');

      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      this.f.porcentaje.setValidators([
        Validators.required,
        Validators.pattern('^([0-9]{1,4})?(.[0-9]{1,2})?$'),
        Minimo(0.01),
        Maximo(100),
      ]);
      this.f.porcentaje.reset('1.00');
    } else {
      this.cmoraporce = false;
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

  changeTipoMora(changeData: boolean = true) {
    this.cobraMonto = this.f.tipoMora.value === 'M';
    this.cobraPorcentaje = this.f.tipoMora.value === 'P';
    if (this.cobraMora && this.cobraMonto) {
      this.f.monto.enable();
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
    } else if (this.cobraMora && this.cobraPorcentaje) {
      this.f.porcentaje.enable();
      this.f.porcentaje.setValidators([
        Validators.required,
        Validators.pattern('^([0-9]{1,4})?(.[0-9]{1,2})?$'),
        Minimo(0.01),
        Maximo(100),
      ]);
      this.f.monto.clearValidators();
      this.f.monto.disable();
      if (changeData) {
        this.f.monto.reset('1.00');
      }
    }
  }

  selectCodigo(event) {
    if (event === 'Otro') {
      //  this.f.codDeudor.reset();
      this.f.nameCod.setValidators([
        Validators.required,
        Validators.minLength(3),
      ]);
    } else {
      this.f.nameCod.clearValidators();
      this.f.nameCod.reset();
    }
  }

  formAction(action: string) {
    if (action === 'save') {
      Object.keys(this.frm.controls).forEach((c) => {
        this.frm.controls[c].markAsDirty();
      });
      this.onSubmitServicio();
    }
  }

  nameCodInput(e) {
    let initalValue = this.f.nameCod.value;
    /* initalValue = initalValue.replace(/[ ]{2}/g, ' ');
     initalValue = initalValue.replace(/[ ]{2}$/g, '');  */
    initalValue = initalValue.replace(/\s{2,}/g, ' ');
    this.f.nameCod.setValue(initalValue.replace(/[^ 0-9-A-Z-a-z]*/g, ''));
  }

  MoraMontoBlur(e) {
    let initalValue = parseFloat(this.f.monto.value);
    if (!isNaN(initalValue)) this.f.monto.setValue(initalValue.toFixed(2));
  }
  MoraPorcenBlur(e) {
    let initalValue = parseFloat(this.f.porcentaje.value);
    if (!isNaN(initalValue)) this.f.porcentaje.setValue(initalValue.toFixed(2));
  }
  nameCodBlur(e) {
    let initalValue = this.f.nameCod.value;
    this.f.nameCod.setValue(initalValue.trim());
  }
  nameSerInput(e) {
    let initalValue = this.f.nombre.value;
    /* initalValue = initalValue.replace(/[ ]{2}/g, ' ');
     initalValue = initalValue.replace(/[ ]{2}$/g, '');  */
    initalValue = initalValue.replace(/\s{2,}/g, ' ');
    this.f.nombre.setValue(
      initalValue.replace(/[^ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]*/g, '')
    );
  }
  // ^[0-9a-zA-ZÑñ]{3,30}$
  nameSerBlur(e) {
    let initalValue = this.f.nombre.value;
    this.f.nombre.setValue(initalValue.trim());
  }

  showAgencyChannel(show: boolean) {
    this.useAgencyChannel = show;
  }
}

function Maximo(max: number) {
  return (c: UntypedFormControl) => {
    let nro = parseFloat(c.value);
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
    let nro = parseFloat(c.value);
    if (!isNaN(nro)) {
      if (nro < min) {
        return { minimo: true };
      }
    }
    return null;
  };
}

function Alfanumerico(c: UntypedFormControl) {
  let regex = /[0-9a-zA-Z]-?/g;
  if (c.value && !regex.test(c.value)) {
    return { alfa: true };
  }
  return null;
}

function Alfabetico(c: UntypedFormControl) {
  let regex = /[0-9]{1,29}-?[a-zA-Z]-?/g;
  let numero = /[0-9]/g;
  let raro = /[-{1,}]-?/g;
  if (c.value && !raro.test(c.value)) {
    return { alfabetico: true };
  }
  if (c.value && !regex.test(c.value)) {
    return { alfabetico: true };
  }

  /* if(c.value && numero.test(c.value)){
     return { alfabetico: true };
   } */
  return null;
}
