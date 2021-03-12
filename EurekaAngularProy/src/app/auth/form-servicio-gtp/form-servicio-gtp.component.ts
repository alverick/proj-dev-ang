import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { MonedaModel, ServiceModel } from "src/app/shared/models";

import { AfiliacionService } from "src/app/shared/services/afiliacion.service";
import { ConfigurarServiciosComponent } from "../configurar-servicios/configurar-servicios.component";

@Component({
  selector: "app-form-servicio-gtp",
  templateUrl: "./form-servicio-gtp.component.html",
  styleUrls: ["./form-servicio-gtp.component.scss"],
})
export class FormServicioGtpComponent implements OnInit {
  public createMode: boolean = false;
  public editMode: boolean = false;
  public gtpMode: boolean = false;
  public Dataparcial: boolean = true;

  private tc = 3.37;
  public codDeu: String;
  public comAgente = 1;
  public comTienda = 7;
  submittedRequired = false;

  constructor(
    private afiliacionService: AfiliacionService,
    private fb: FormBuilder,
    private stateEdit: ConfigurarServiciosComponent
  ) {
    stateEdit.onFormAction.subscribe((e) => this.formAction(e));
  }

  @Input() set service(value: ServiceModel) {
    /* if (value === null || value === undefined) {
       this._service = {
         nombre: 'Mensualidad',
         codDeudor: 'DNI',
         tipoDato: 'C',
         tipoPago: 'C',
         idCuenta: 0,
         nroCuenta: '',
         moneda: '001',
         simboloMoneda: 'S/',
         usaWebApp: true,
         usaAgente: false,
         usaTienda: false,
         cobraMora: 'N',
         periodoMora: '1',
         tipoMora: 'M'
       }
       this.simboloMoneda = 'S/';
     }
     else {

     } */
    this._service = value;
    this.simboloMoneda = value.simboloMoneda;
    this._service.simboloMoneda = this.simboloMoneda;
    if (this.simboloMoneda === "S/") {
      this.comAgente = 1;
      this.comTienda = 7;
    } else {
      this.comAgente = Math.round((1 / this.tc) * 100) / 100;
      this.comTienda = Math.round((7 / this.tc) * 100) / 100;
    }
  }

  get f(): any {
    return this.frm.controls;
  }

  frm: FormGroup;

  codDeudor: any[] = [];
  tiposDato: any[] = [];
  tiposPago: any[] = [];
  monedas: MonedaModel[] = [];
  tiposMora: any[] = [];
  cuentas: any[] = [];
  simboloMoneda: string = "S/";
  cobraMora: boolean = false;
  cobraMonto: boolean = true;
  cobraPorcentaje: boolean = false;
  cmoraporce: boolean = false;
  private _service: ServiceModel;
  @Output() grabar = new EventEmitter<any>();
  public services: ServiceModel[] = [];

  ngOnInit(): void {
    this.afiliacionService.GetTipoCambio().subscribe((d) => (this.tc = d));
    this.editMode =
      this._service.id !== null &&
      this._service.id !== undefined &&
      this._service.id > 0;
    this.gtpMode =
      this._service.NewName !== null && this._service.NewNameCod !== null;
    this.codDeu =
      this._service.codDeudor == null || this._service.codDeudor === ""
        ? this._service.nameCod
        : this._service.codDeudor;

    var montod =
      this._service.monto !== null && this._service.monto !== undefined
        ? this._service.monto
        : "1.00";
    var porcentajed =
      this._service.porcentaje !== null &&
      this._service.porcentaje !== undefined
        ? this._service.porcentaje
        : "1.00";

    this.frm = this.fb.group({
      nombre: new FormControl(
        {
          value:
            this._service.newNameGtpStatus === 0 ||
            this._service.newNameGtpStatus === 3
              ? this._service.newName
              : this._service.nombre,
          disabled: this._service.nombreHabilitado,
        },
        [
          Validators.required,
          Validators.minLength(3),
          Alfanumerico,
          Validators.pattern(
            "^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$"
          ),
        ]
      ),

      codDeudor: new FormControl(
        {
          value:
            this._service.newNameCodeGtpStatus === 1 ||
            this._service.newNameCodeGtpStatus === 2
              ? this._service.codDeudor
              : this._service.newNameCode === "RUC" ||
                this._service.newNameCode === "DNI" ||
                this._service.newNameCode === "Codigo Interno"
              ? this._service.newNameCode
              : "Otro",
          disabled: this._service.nombreCodHabilitado,
        },
        [Validators.required]
      ),

      nameCod: new FormControl({
        value: this._service.newNameCode,
        disabled: this._service.newNameCodeGtpStatus === 3 ? false : true,
      }),

      tipoDato: new FormControl(
        { value: this._service.tipoDato, disabled: this.gtpMode },
        Validators.required
      ),
      tipoPago: new FormControl(
        { value: this._service.tipoPago, disabled: this.gtpMode },
        Validators.required
      ),
      idCuenta: new FormControl(
        { value: this._service.idCuenta.toString(), disabled: true },
        [Validators.required, Validators.minLength(13)]
      ),
      moneda: new FormControl(
        { value: this._service.moneda, disabled: true },
        Validators.required
      ),
      usaAgente: new FormControl({
        value: this._service.usaAgente,
        disabled: true,
      }),
      usaTienda: new FormControl({
        value: this._service.usaTienda,
        disabled: true,
      }),
      usaWebApp: new FormControl({
        value: this._service.usaWebApp,
        disabled: true,
      }),
      cobraMora: new FormControl(
        { value: this._service.cobraMora, disabled: true },
        Validators.required
      ),
      periodoMora: new FormControl({
        value: this._service.periodoMora,
        disabled: true,
      }),
      tipoMora: new FormControl({
        value: this._service.tipoMora,
        disabled: true,
      }),
      monto: new FormControl({ value: montod, disabled: true }),
      porcentaje: new FormControl({ value: porcentajed, disabled: true }),
      pagoPartes: new FormControl(
        { value: this._service.pagoPartes, disabled: true },
        Validators.required
      ),
    });

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
      this.frm.get("idCuenta").setValue(this._service.idCuenta);
    });
    this.changeMora(false);
    this.changeTipoMora(false);

    if (this.frm.get("cobraMora").value === "N") {
      this.frm.get("periodoMora").setValue("");
      this.cmoraporce = false;
    }
    if (this.frm.get("cobraMora").value === "S") {
      this.cmoraporce = true;
    }
    // combo para ocultar si es data parcial
    if (this.frm.get("tipoDato").value === "P") {
      /* this.frm.get('tipoPago').setValue('C');
      this.tiposPago.pop();*/
      this.Dataparcial = false;
    } else {
      this.Dataparcial = true;
    }
  }

  /* nombreAlert2() {
     return (this._service.nombre === '?' && this._service.newName.substring(0, 3) === '???') ? false : true;
   } */
  nombreAlert() {
    return this._service.newNameGtpStatus === 3 ? false : true;
  }
  /* CodiAlert2() {
     return (this._service.codDeudor === '?' && this._service.newNameCode.substring(0, 3) === '???' ) ? false :  true;
   } */
  CodiAlert() {
    return this._service.newNameCodeGtpStatus === 3 ? false : true;
  }

  onChangeTipoDato() {
    if (this.frm.get("tipoDato").value === "P") {
      /* this.frm.get('tipoPago').setValue('C');
       this.tiposPago.pop();*/
      this.Dataparcial = false;
      // cobraMora
      this.frm.get("cobraMora").setValue("N");
      this.frm.get("pagoPartes").setValue("N");

      this.frm.get("monto").setValue("1.00");
      this.frm.get("porcentaje").setValue("1.00");
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

  onSubmitServicio() {
    this.submittedRequired = true;
    if (this.frm.valid) {
      let value: ServiceModel;
      value = this._service;

      /* if (this._service.NewName) {
         value.codDeudor = this.frm.value.codDeudor;
         value.nameCod = this.frm.value.nameCod;
         this.grabar.emit(value);
       } else {
         value.nombre = this.frm.value.nombre;
         if (this._service.NewNameCod) {
           this.grabar.emit(value);
         } else {
           value.codDeudor = this.frm.value.codDeudor;
           value.nameCod = this.frm.value.nameCod;
           this.grabar.emit(value);
         }
       } */
      /*  if ( this._service.newName.substring(0, 3) === '???' ) {
          value.nombre = this.frm.value.nombre;
        } else {
          value.nombre = null;
        }
        if ( this._service.newNameCode.substring(0, 3) === '???') {
          value.codDeudor = this.frm.value.codDeudor;
          value.nameCod = this.frm.value.nameCod;
        } else {
          value.codDeudor = null;
          value.nameCod = null;
        } */
      // value.nombre = ( this._service.newName.substring(0, 3) === '???') ? this.frm.value.nombre : value.nombre ;
      value.newName =
        this._service.newNameGtpStatus === 3
          ? this.frm.value.nombre
          : value.nombre;
      // tslint:disable-next-line:max-line-length
      /* if (value.newNameCode === 'RUC' || value.newNameCode === 'DNI' || value.newNameCode === 'Codigo Interno' || value.newNameCode === 'Codigo') {
         value.newNameCode = ( this._service.newNameCodeGtpStatus === 3 ) ? this.frm.value.codDeudor : this._service.newNameCode;
       } else {
         value.newNameCode = ( this._service.newNameCodeGtpStatus === 3 ) ? this.frm.value.nameCod : this._service.newNameCode;
       } */

      if (
        this.frm.value.codDeudor === "RUC" ||
        this.frm.value.codDeudor === "DNI" ||
        this.frm.value.codDeudor === "Codigo Interno" ||
        this.frm.value.codDeudor === "Codigo"
      ) {
        value.newNameCode =
          this._service.newNameCodeGtpStatus === 3
            ? this.frm.value.codDeudor
            : this._service.newNameCode;
      } else {
        value.newNameCode =
          this._service.newNameCodeGtpStatus === 3
            ? this.frm.value.nameCod
            : this._service.newNameCode;
        value.nameCod =
          this._service.newNameCodeGtpStatus === 3
            ? this.frm.value.nameCod
            : this._service.newNameCode;
      }
      console.log(
        "valores" + value.nombre + "f" + value.codDeudor + "f" + value.nameCod
      );
      this.grabar.emit(value);
    }
  }

  changeMoneda(event) {
    console.log("hola " + event);
    this.simboloMoneda = this.f.moneda.value === "001" ? "S/" : "$";
  }

  changeCuenta(val) {
    let cta = this.cuentas.find((c) => c.id == val);
    this.simboloMoneda = cta.currency === "001" ? "S/" : "$";
    this.f.moneda.setValue(cta.currency);
  }

  TipoCobro() {
    this.frm.get("tipoMora").setValue("M");
    this.cobraMonto = true;
    this.cobraPorcentaje = false;
    if (
      this.frm.get("periodoMora").value === "1" ||
      this.frm.get("periodoMora").value === "2"
    ) {
      this.cmoraporce = true;
      this.f.monto.clearValidators();
      this.f.monto.enable();
      this.f.monto.setValidators([
        Validators.required,
        Validators.pattern("^([0-9]{1,4})?(.[0-9]{1,2})?$"),
        Minimo(0.5),
        Maximo(1000),
      ]);
      this.f.monto.reset("1.00");

      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      this.f.porcentaje.setValidators([
        Validators.required,
        Validators.pattern("^([0-9]{1,4})?(.[0-9]{1,2})?$"),
        Minimo(0.01),
        Maximo(100),
      ]);
      this.f.porcentaje.reset("1.00");
    } else {
      this.cmoraporce = false;
    }
  }
  Codigo(event) {
    if (event === "Otro") {
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
    this.cobraMora = this.f.cobraMora.value === "S";
    console.log(this.f.cobraMora.value);
    if (this.cobraMora) {
      this.f.periodoMora.setValidators([Validators.required]);
      this.f.monto.enable();
      this.f.monto.setValidators([
        Validators.required,
        Validators.pattern("^([0-9]{1,4})?(.[0-9]{1,2})?$"),
        Minimo(0.5),
        Maximo(1000),
      ]);
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      if (changeData) {
        this.f.porcentaje.reset("1.00");
      }
    } else {
      console.log("entra en no");
      this.cmoraporce = false;
      // this.f.periodoMora.setValue('1')
      this.f.periodoMora.reset();
      this.f.periodoMora.clearValidators();
      this.f.periodoMora.updateValueAndValidity();
      this.f.monto.clearValidators();
      this.f.monto.disable();
      if (changeData) {
        this.f.monto.reset("1.00");
      }
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      if (changeData) {
        this.f.porcentaje.reset("1.00");
      }
    }
  }

  changeTipoMora(changeData: boolean = true) {
    this.cobraMonto = this.f.tipoMora.value === "M";
    this.cobraPorcentaje = this.f.tipoMora.value === "P";
    if (this.cobraMora && this.cobraMonto) {
      this.f.monto.enable();
      this.f.monto.setValidators([
        Validators.required,
        Validators.pattern("^([0-9]{1,4})?(.[0-9]{1,2})?$"),
        Minimo(0.5),
        Maximo(1000),
      ]);
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      if (changeData) {
        this.f.porcentaje.reset("1.00");
      }
    } else if (this.cobraMora && this.cobraPorcentaje) {
      this.f.porcentaje.enable();
      this.f.porcentaje.setValidators([
        Validators.required,
        Validators.pattern("^([0-9]{1,4})?(.[0-9]{1,2})?$"),
        Minimo(0.01),
        Maximo(100),
      ]);
      this.f.monto.clearValidators();
      this.f.monto.disable();
      if (changeData) {
        this.f.monto.reset("1.00");
      }
    }
  }

  selectCodigo(event) {
    if (event === "Otro") {
      //  this.f.codDeudor.reset();
      this.f.nameCod.setValidators([
        Validators.required,
        Validators.minLength(3),
      ]);
      this.f.nameCod.reset();
    } else {
      this.f.nameCod.clearValidators();
      this.f.nameCod.reset();
    }
  }

  formAction(action: string) {
    if (action === "save") {
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
    initalValue = initalValue.replace(/\s{2,}/g, " ");
    this.f.nameCod.setValue(initalValue.replace(/[^ 0-9-A-Z-a-z]*/g, ""));
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
    initalValue = initalValue.replace(/\s{2,}/g, " ");
    this.f.nombre.setValue(
      initalValue.replace(/[^ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]*/g, "")
    );
  }
  // ^[0-9a-zA-ZÑñ]{3,30}$
  nameSerBlur(e) {
    let initalValue = this.f.nombre.value;
    this.f.nombre.setValue(initalValue.trim());
  }
}

function Maximo(max: number) {
  return (c: FormControl) => {
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
  return (c: FormControl) => {
    let nro = parseFloat(c.value);
    if (!isNaN(nro)) {
      if (nro < min) {
        return { minimo: true };
      }
    }
    return null;
  };
}

function Alfanumerico(c: FormControl) {
  let regex = /[0-9a-zA-Z]-?/g;
  if (c.value && !regex.test(c.value)) {
    return { alfa: true };
  }
  return null;
}

function Alfabetico(c: FormControl) {
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
