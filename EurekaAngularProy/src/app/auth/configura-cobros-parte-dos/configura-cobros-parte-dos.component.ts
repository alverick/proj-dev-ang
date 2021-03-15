import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { AfiliacionService } from "src/app/shared/services/afiliacion.service";
import { Router } from "@angular/router";
import { ServiceModel } from "src/app/shared/models";
import Swal from "sweetalert2";
import { drawPopup } from "src/app/shared/services/popups";

declare var $: any;

@Component({
  selector: "app-configura-cobros-parte-dos",
  templateUrl: "./configura-cobros-parte-dos.component.html",
  styleUrls: ["./configura-cobros-parte-dos.component.scss"],
})
export class ConfiguraCobrosParteDosComponent implements OnInit {
  frm: FormGroup;
  public editMode: boolean = false;
  public Dataparcial: boolean = true;
  submittedRequired = false;
  codDeudor: any[] = [];
  tiposPago: any[] = [];
  tiposMora: any[] = [];
  _service: ServiceModel;
  tipoDato: string = "";
  cobraMora: boolean = false;
  cmoraporce: boolean = false;
  cobraMonto: boolean = true;
  cobraPorcentaje: boolean = false;
  simboloMoneda: string = "S/";

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private afiliacionService: AfiliacionService
  ) {}

  get f(): any {
    return this.frm.controls;
  }

  ngOnInit() {
    this.editMode = this.afiliacionService.editMode;
    this._service = Object.assign(
      {},
      this.afiliacionService.currentServiceModel
    );

    var montod =
      this._service.monto !== null && this._service.monto !== undefined
        ? this._service.monto
        : "1.00";
    var porcentajed =
      this._service.porcentaje !== null &&
      this._service.porcentaje !== undefined
        ? this._service.porcentaje
        : "1.00";
    let codDeudor =
      //this._service.newNameCodeGtpStatus === undefined ||
      this._service.newNameCodeGtpStatus === null ||
      this._service.newNameCodeGtpStatus === 1 ||
      this._service.newNameCodeGtpStatus === 2
        ? this._service.codDeudor === "RUC" ||
          this._service.codDeudor === "DNI" ||
          this._service.codDeudor === "Codigo Interno"
          ? this._service.codDeudor
          : "Otro"
        : this._service.newNameCode === "RUC" ||
          this._service.newNameCode === "DNI" ||
          this._service.newNameCode === "Codigo Interno"
        ? this._service.newNameCode
        : "DNI";

    this.frm = this.fb.group({
      tipoDato: new FormControl(
        {
          value: this._service.tipoDato,
          disabled: this.editMode,
        },
        Validators.required
      ),
      codDeudor: new FormControl(
        {
          value: codDeudor,
          disabled: this._service.nombreCodHabilitado,
        },
        [Validators.required]
      ),
      nameCod: new FormControl({
        value:
          this._service.codDeudor === null
            ? this._service.newNameCode
            : this._service.codDeudor === "Otro"
            ? this._service.nameCod
            : this._service.codDeudor,
        disabled: this._service.nombreCodHabilitado,
      }),
      tipoPago: new FormControl(
        { value: this._service.tipoPago, disabled: this.editMode },
        Validators.required
      ),
      pagoPartes: [this._service.pagoPartes, Validators.required],
      cobraMora: [this._service.cobraMora, Validators.required],
      periodoMora: [this._service.periodoMora],
      tipoMora: [this._service.tipoMora],
      monto: new FormControl({ value: montod, disabled: true }),
      porcentaje: new FormControl({ value: porcentajed, disabled: true }),
    });

    // nameCod: new FormControl({
    //   value:
    //     this.afiliacionService.currentServiceModel.codDeudor === null
    //       ? this.afiliacionService.currentServiceModel.newNameCode
    //       : this.afiliacionService.currentServiceModel.codDeudor === "Otro"
    //       ? this.afiliacionService.currentServiceModel.nameCod
    //       : this.afiliacionService.currentServiceModel.codDeudor,
    //   disabled: this.afiliacionService.currentServiceModel.nombreCodHabilitado,
    // }),

    this.afiliacionService
      .GetCodDeudor()
      .subscribe((d) => (this.codDeudor = d));
    this.afiliacionService.GetTipoPago().subscribe((d) => {
      this.tiposPago = d;
    });
    this.afiliacionService
      .GetPeriodoMora()
      .subscribe((d) => (this.tiposMora = d));

    this.changeMora(false);
    this.changeTipoMora(false);

    this.showPartialDataComponents(this.frm.get("tipoDato").value);
    this.resetPeriodoMora(this.frm.get("cobraMora").value);
  }

  showPartialDataComponents(tipoDato: string): void {
    if (tipoDato === "P" || tipoDato === "S") {
      this.Dataparcial = false;
    } else {
      this.Dataparcial = true;
    }
  }

  resetPartialDataComponents(tipoDato: string): void {
    if (tipoDato === "P" || tipoDato === "S") {
      this.frm.get("cobraMora").setValue("N");
      this.frm.get("pagoPartes").setValue("N");

      this.frm.get("monto").setValue("1.00");
      this.frm.get("porcentaje").setValue("1.00");
      this.cmoraporce = false;
      this.cobraMora = false;

      this.frm.get('tipoPago').setValue('C');
    }
  }

  resetPeriodoMora(cobraMora: string){
    if (cobraMora === "N" || cobraMora === '') {
      this.frm.get("periodoMora").setValue("");
      this.cmoraporce = false;
    }
    if (cobraMora === "S") {
      this.cmoraporce = true;
    }
  }

  onImgDoubt() {}

  goBack() {
    this.router.navigate(["/configuraCobrosParteUno"]);
  }

  onSubmitServicio() {
    this.submittedRequired = true;
    if (this.frm.valid) {

      const monto = parseFloat(this.frm.get("monto").value);
      const porcentaje = parseFloat(this.frm.get("porcentaje").value);
      const montofix = monto.toFixed(2);
      const porcentajefix = porcentaje.toFixed(2);
      this.frm.value.monto = montofix;
      this.frm.value.porcentaje = porcentajefix;

      if (this.frm.get("cobraMora").value === "S") {
        if (this.frm.get("tipoMora").value === "M") {
          if (monto !== null) {
            if (monto > 1000) {
              Swal.fire({
                text: "el maximo monto que se puede ingresar es 1000",
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: "CERRAR",
                allowOutsideClick: false,
                onOpen: drawPopup,
              });
              return;
            }
            if (monto < 0.5) {
              Swal.fire({
                text: "el minimo monto que se puede ingresar es 0.50",
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: "CERRAR",
                allowOutsideClick: false,
                onOpen: drawPopup,
              });
              return;
            }else{
              let value: ServiceModel;
              value = this._service;
              if (this.editMode) {
                value.newNameCode = value.nombreCodHabilitado
                ? value.newNameCode
                : this.frm.value.codDeudor === "Otro"
                ? this.frm.value.nameCod === value.codDeudor
                  ? value.newNameCode
                  : this.frm.value.nameCod
                : this.frm.value.codDeudor === value.codDeudor
                ? value.newNameCode
                : this.frm.value.codDeudor;
              }else{
                value.newNameCode =
                this.frm.value.codDeudor === "Otro"
                  ? this.frm.value.nameCod
                  : this.frm.value.codDeudor;
              }
              //Estable Servicio
              this.setCurrentServiceModel(value.newNameCode);
              this.nextPage();
            }
          }else{
            Swal.fire({
              text: "Ingrese el monto",
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: "CERRAR",
              allowOutsideClick: false,
              onOpen: drawPopup,
            });
            return;
          }
        }else{
          if (porcentaje === null) {
            Swal.fire({
              text: "Ingrese el porcentaje",
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: "CERRAR",
              allowOutsideClick: false,
              onOpen: drawPopup,
            });
            return;
          }
          if (porcentaje > 100) {
            Swal.fire({
              text: "el maximo porcentaje que se puede ingresar es 100",
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: "CERRAR",
              allowOutsideClick: false,
              onOpen: drawPopup,
            });
            return;
          }
          if (porcentaje < 0.01) {
            Swal.fire({
              text: "el minimo porcentaje 0.01%",
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: "CERRAR",
              allowOutsideClick: false,
              onOpen: drawPopup,
            });
            return;
          } else {
            let value: ServiceModel;
            value = this._service;
            if (this.editMode) {
              value.newNameCode = value.nombreCodHabilitado
                  ? value.newNameCode
                  : this.frm.value.codDeudor === "Otro"
                  ? this.frm.value.nameCod === value.codDeudor
                    ? value.newNameCode
                    : this.frm.value.nameCod
                  : this.frm.value.codDeudor === value.codDeudor
                  ? value.newNameCode
                  : this.frm.value.codDeudor;
            }else{
              value.newNameCode =
                  this.frm.value.codDeudor === "Otro"
                    ? this.frm.value.nameCod
                    : this.frm.value.codDeudor;
            }
            ///Set Servicio
            this.setCurrentServiceModel(value.newNameCode);
            this.nextPage();
          }
        }
      }else{
        let value: ServiceModel;
        value = this._service;
        if (this.editMode) {
          value.newNameCode = value.nombreCodHabilitado
          ? value.newNameCode
          : this.frm.value.codDeudor === "Otro"
          ? this.frm.value.nameCod === value.codDeudor
            ? value.newNameCode
            : this.frm.value.nameCod
          : this.frm.value.codDeudor === value.codDeudor
          ? value.newNameCode
          : this.frm.value.codDeudor;
        } else {
          value.newNameCode =
          this.frm.value.codDeudor === "Otro"
            ? this.frm.value.nameCod
            : this.frm.value.codDeudor;
        }
        //Set Servicio
        this.setCurrentServiceModel(value.newNameCode);
        this.nextPage();

      }
    }
  }

  setCurrentServiceModel(newNameCode: string){
    this.afiliacionService.currentServiceModel.tipoDato = this.f.tipoDato.value;
    this.afiliacionService.currentServiceModel.codDeudor = this.f.codDeudor.value;
    this.afiliacionService.currentServiceModel.nameCod = this.f.nameCod.value;
    this.afiliacionService.currentServiceModel.newNameCode = newNameCode;
    this.afiliacionService.currentServiceModel.tipoPago = this.f.tipoPago.value;
    this.afiliacionService.currentServiceModel.pagoPartes = this.f.pagoPartes.value;
    this.afiliacionService.currentServiceModel.cobraMora = this.f.cobraMora.value;
    this.afiliacionService.currentServiceModel.periodoMora = this.f.periodoMora.value;
    this.afiliacionService.currentServiceModel.tipoMora = this.f.tipoMora.value;
    //this.afiliacionService.currentServiceModel.monto = parseFloat(this.f.monto.value);
    //this.afiliacionService.currentServiceModel.porcentaje = parseFloat(this.f.porcentaje.value);
    this.afiliacionService.currentServiceModel.monto = this.f.monto.value;
    this.afiliacionService.currentServiceModel.porcentaje = this.f.porcentaje.value;
    console.log(this.afiliacionService.currentServiceModel);
  }

  nextPage(){
    this.router.navigate(["/configuraCobrosParteTres"]);
  }

  changeTipoDato(changeData: boolean = true) {
    this.tipoDato = this.f.tipoDato.value;

    this.showModal(this.tipoDato);

    this.showPartialDataComponents(this.tipoDato);
    this.resetPartialDataComponents(this.tipoDato);
  }

  showModal(tipoDato: string){
    switch (tipoDato) {
      case "C": {
        $("#complete-data").modal("show");
        break;
      }
      case "P": {
        $("#partial-data").modal("show");
        break;
      }
      case "S": {
        $("#no-data").modal("show");
        break;
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

  nameCodInput(e) {
    let initalValue = this.f.nameCod.value;
    /* initalValue = initalValue.replace(/[ ]{2}/g, ' ');
     initalValue = initalValue.replace(/[ ]{2}$/g, '');  */
    initalValue = initalValue.replace(/\s{2,}/g, " ");
    this.f.nameCod.setValue(initalValue.replace(/[^ 0-9-A-Z-a-z]*/g, ""));
  }

  nameCodBlur(e) {
    let initalValue = this.f.nameCod.value;
    this.f.nameCod.setValue(initalValue.trim());
  }

  CodiAlert() {
    if (this.afiliacionService.editMode === true) {
      if (this._service.newNameCode !== "") {
        return true;
      }
      return false;
    }
  }

  changeMora(changeData: boolean = true) {
    this.cobraMora = this.f.cobraMora.value === "S";
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

  MoraMontoBlur(e) {
    let initalValue = parseFloat(this.f.monto.value);
    if (!isNaN(initalValue)) this.f.monto.setValue(initalValue.toFixed(2));
  }

  MoraPorcenBlur(e) {
    let initalValue = parseFloat(this.f.porcentaje.value);
    if (!isNaN(initalValue)) this.f.porcentaje.setValue(initalValue.toFixed(2));
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
