import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { AfiliacionService } from "src/app/shared/services/afiliacion.service";
import { ServiceModel } from "src/app/shared/models";
import Swal from "sweetalert2";
import { drawPopup } from "src/app/shared/services/popups";

declare var $: any;

@Component({
  selector: "app-editar-cobros",
  templateUrl: "./editar-cobros.component.html",
  styleUrls: ["./editar-cobros.component.scss"],
  styles: [
    `
      :host >>> .tooltip-inner {
        background-color: #fff;
        color: #0d131d !important;
        border-radius: 4px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
        font-size: 11px !important;
        padding: 0.5em 0.3em;
        min-width: 300px !important;
      }
      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #0d131d57;
      }
    `,
  ],
})
export class EditarCobrosComponent implements OnInit {
  frm: FormGroup;
  public editMode: boolean = false;
  public Dataparcial: boolean = true;
  public affiliationFlow: boolean = false;
  submittedRequired = false;
  codDeudor: any[] = [];
  tiposPago: any[] = [];
  tiposMora: any[] = [];
  tiposDato: any[] = [];
  pagoPartes: any[] = [];
  cuentas: any[] = [];
  _service: ServiceModel;
  tipoDato: string = "";
  cobraMora: boolean = false;
  cmoraporce: boolean = false;
  cobraMonto: boolean = true;
  cobraPorcentaje: boolean = false;
  simboloMoneda: string = "S/";
  currencySymbolSoles: string = "S/";
  currencySymbolDollars: string = "$";
  private tc: number = 3.37;
  commissionAgentSoles = 1.5;
  commissionAgentDollars =
    Math.round((this.commissionAgentSoles / this.tc) * 100) / 100;
  //public comTienda = 8;
  commissionStoreSoles = 8;
  commissionStoreDollars =
    Math.round((this.commissionStoreSoles / this.tc) * 100) / 100;
  useAgencyChannel: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private afiliacionService: AfiliacionService,
    private route: ActivatedRoute,
  ) {}

  get f(): any {
    return this.frm.controls;
  }

  ngOnInit() {
    this.route.data.subscribe(d => {
      //this.editMode = d.isEdit;
      this.affiliationFlow = d.affiliationFlow;
    });
    this.cuentas = [];
    //this.editMode = this.afiliacionService.editMode;

    if (this.isNew() == true) {
      //////this.initializeService();

    } else {
      this.getService();
      this.initializeForm();

    }

    if(this.affiliationFlow == true){
      this.showAgencyChannel(true);
    }else{
      this.showAgencyChannel(this._service.useAgencyChannel);
    }
}

  isNew(): boolean {
    if (
      this.afiliacionService.currentServiceModel === null ||
      this.afiliacionService.currentServiceModel === undefined
    ) {
      return true;
    } else {
      return false;
    }
  }

  getService() {
    this._service = Object.assign(
      {},
      this.afiliacionService.currentServiceModel
    );
  }

  initializeForm() {
    this.editMode = this._service.id !== null && this._service.id !== undefined && this._service.id > 0;
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
      this._service.newNameCodeGtpStatus === undefined ||
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
      nombre: new FormControl(
        {
          value:
            this._service.newNameGtpStatus === 0 ||
            (this._service.newNameGtpStatus === 3 &&
              this._service.nombre == null)
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
      res: new FormControl({ value: this._service.res, disabled: true }),
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
      idCuenta: new FormControl(
        { value: this._service.idCuenta.toString(), disabled: this.editMode },
        Validators.required
      ),
      moneda: [this._service.moneda, Validators.required],
      usaAgente: new FormControl({
        value: this._service.usaAgente,
        disabled: this.editMode,
      }),
      usaTienda: new FormControl({
        value: this._service.usaTienda,
        disabled: this.editMode,
      }),
      usaWebApp: new FormControl({
        value: this._service.usaWebApp,
        disabled: true,
      }),
    });

    this.afiliacionService
      .GetCodDeudor()
      .subscribe((d) => (this.codDeudor = d));
    this.afiliacionService.GetTipoDato().subscribe((d) => (this.tiposDato = d));
    this.afiliacionService
      .GetPagoPartes()
      .subscribe((d) => (this.pagoPartes = d));
    this.afiliacionService.GetTipoPago().subscribe((d) => {
      this.tiposPago = d;
    });
    this.afiliacionService
      .GetPeriodoMora()
      .subscribe((d) => (this.tiposMora = d));
    this.afiliacionService.GetCards().subscribe((d) => {
      this.cuentas = d;
    });
    this.afiliacionService.GetTipoCambio().subscribe((d) => {
      this.tc = d;
      this.calculateCommissions();
    });

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

      this.frm.get("tipoPago").setValue("C");
    }
  }

  resetPeriodoMora(cobraMora: string) {
    if (cobraMora === "N" || cobraMora === "") {
      this.frm.get("periodoMora").setValue("");
      this.cmoraporce = false;
    }
    if (cobraMora === "S") {
      this.cmoraporce = true;
    }
  }

  goBack() {
    this.showDiscardChanges(true);
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

      if (
        this.f.usaAgente.value === false &&
        this.f.usaTienda.value === false &&
        this.f.usaWebApp.value === false
      ) {
        Swal.fire({
          text: "Debe escoger un medio de pago",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: "CERRAR",
          allowOutsideClick: false,
          onOpen: drawPopup,
        });
      } else {
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
              } else {
                let value: ServiceModel;
                value = this._service;
                if (this.editMode) {
                  if (this.frm.value.idCuenta)
                    value.idCuenta = this.frm.value.idCuenta;
                  else value.idCuenta = this.f.idCuenta.value;
                  value.newName = value.nombreHabilitado
                    ? value.newName
                    : this.frm.value.nombre === value.nombre
                    ? value.newName
                    : this.frm.value.nombre;
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
                  this._service.newName = this.frm.value.nombre;
                  value.newNameCode =
                    this.frm.value.codDeudor === "Otro"
                      ? this.frm.value.nameCod
                      : this.frm.value.codDeudor;
                }

                let cta = this.cuentas.find((c) => c.id === value.idCuenta);
                value.nroCuenta = `${cta.number.substr(0, 13)} (${
                  cta.currency === "001" ? "Soles" : "Dólares"
                })`;
                value.moneda = this.frm.value.moneda;
                value.simboloMoneda = this.simboloMoneda;

                //Establece Servicio
                if (this.isAddedName(this.f.nombre.value) === false) {
                  this.setCurrentServiceModel(
                    value.newNameCode,
                    this.f.nombre.value,
                    value.idCuenta,
                    value.nroCuenta,
                    value.simboloMoneda,
                    value.moneda,
                    value.newName
                  );
                  this.nextPage();
                }
              }
            } else {
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
          } else {
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
                if (this.frm.value.idCuenta)
                  value.idCuenta = this.frm.value.idCuenta;
                else value.idCuenta = this.f.idCuenta.value;
                value.newName = value.nombreHabilitado
                  ? value.newName
                  : this.frm.value.nombre === value.nombre
                  ? value.newName
                  : this.frm.value.nombre;
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
                this._service.newName = this.frm.value.nombre;
                value.newNameCode =
                  this.frm.value.codDeudor === "Otro"
                    ? this.frm.value.nameCod
                    : this.frm.value.codDeudor;
              }
              let cta = this.cuentas.find((c) => c.id === value.idCuenta);
              value.nroCuenta = `${cta.number.substr(0, 13)} (${
                cta.currency === "001" ? "Soles" : "Dólares"
              })`;
              value.moneda = this.frm.value.moneda;
              value.simboloMoneda = this.simboloMoneda;

              ///Set Servicio
              if (this.isAddedName(this.f.nombre.value) === false) {
                this.setCurrentServiceModel(
                  value.newNameCode,
                  this.f.nombre.value,
                  value.idCuenta,
                  value.nroCuenta,
                  value.simboloMoneda,
                  value.moneda,
                  value.newName
                );
                this.nextPage();
              }
            }
          }
        } else {
          let value: ServiceModel;
          value = this._service;
          if (this.editMode) {
            if (this.frm.value.idCuenta)
              value.idCuenta = this.frm.value.idCuenta;
            else value.idCuenta = this.f.idCuenta.value;
            value.newName = value.nombreHabilitado
              ? value.newName
              : this.frm.value.nombre === value.nombre
              ? value.newName
              : this.frm.value.nombre;
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
            this._service.newName = this.frm.value.nombre;
            value.newNameCode =
              this.frm.value.codDeudor === "Otro"
                ? this.frm.value.nameCod
                : this.frm.value.codDeudor;
          }
          let cta = this.cuentas.find((c) => c.id === value.idCuenta);
          value.nroCuenta = `${cta.number.substr(0, 13)} (${
            cta.currency === "001" ? "Soles" : "Dólares"
          })`;
          value.moneda = this.frm.value.moneda;
          value.simboloMoneda = this.simboloMoneda;
          //Set Servicio
          if (this.isAddedName(this.f.nombre.value) === false) {
            this.setCurrentServiceModel(
              value.newNameCode,
              this.f.nombre.value,
              value.idCuenta,
              value.nroCuenta,
              value.simboloMoneda,
              value.moneda,
              value.newName
            );
            this.nextPage();
          }
        }
      }
    }
  }

  setCurrentServiceModel(
    newNameCode: string,
    nombre: string,
    idCuenta: string,
    nroCuenta: string,
    simboloMoneda: string,
    moneda: string,
    newName: string,
  ) {
    this.afiliacionService.currentServiceModel.nombre = nombre;
    this.afiliacionService.currentServiceModel.newName = newName;

    this.afiliacionService.currentServiceModel.tipoDato = this.f.tipoDato.value;
    this.afiliacionService.currentServiceModel.codDeudor = this.f.codDeudor.value;
    this.afiliacionService.currentServiceModel.nameCod = this.f.nameCod.value;
    this.afiliacionService.currentServiceModel.newNameCode = newNameCode;
    this.afiliacionService.currentServiceModel.tipoPago = this.f.tipoPago.value;
    this.afiliacionService.currentServiceModel.pagoPartes = this.f.pagoPartes.value;
    this.afiliacionService.currentServiceModel.cobraMora = this.f.cobraMora.value;
    this.afiliacionService.currentServiceModel.periodoMora = this.f.periodoMora.value;
    this.afiliacionService.currentServiceModel.tipoMora = this.f.tipoMora.value;
    this.afiliacionService.currentServiceModel.monto = this.f.monto.value;
    this.afiliacionService.currentServiceModel.porcentaje = this.f.porcentaje.value;

    this.afiliacionService.currentServiceModel.idCuenta = idCuenta;
    this.afiliacionService.currentServiceModel.nroCuenta = nroCuenta;
    this.afiliacionService.currentServiceModel.simboloMoneda = simboloMoneda;
    this.afiliacionService.currentServiceModel.moneda = moneda;

    this.afiliacionService.currentServiceModel.usaWebApp = this.f.usaWebApp.value;
    this.afiliacionService.currentServiceModel.usaAgente = this.f.usaAgente.value;
    this.afiliacionService.currentServiceModel.usaTienda = this.f.usaTienda.value;
  }

  nextPage() {
    if (this.affiliationFlow == true) {
      this.router.navigate(["/resumenCobrosAfiliacion"]);
    } else {
      this.router.navigate(["/resumenCobros"]);
    }
  }

  isAddedName(nombre: string): boolean {
    let addedName = false;
    this.afiliacionService.services.forEach((service, index) => {
      if (
        service.nombre !== null &&   service.nombre.toUpperCase() === nombre.toUpperCase() &&
        index !== this.afiliacionService.currentIndex
      ) {
        Swal.fire({
          text: "Este servicio ya existe",
          allowOutsideClick: false,
          onOpen: drawPopup,
        });
        addedName = true;
      }
    });

    return addedName;
  }

  changeTipoDato(changeData: boolean = true) {
    this.tipoDato = this.f.tipoDato.value;

    this.showModal(this.tipoDato);

    this.showPartialDataComponents(this.tipoDato);
    this.resetPartialDataComponents(this.tipoDato);
  }

  showModal(tipoDato: string) {
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
    if (this.editMode === true) {
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

  nameSerInput(e) {
    let initalValue = this.f.nombre.value;
    /* initalValue = initalValue.replace(/[ ]{2}/g, ' ');
     initalValue = initalValue.replace(/[ ]{2}$/g, '');  */
    initalValue = initalValue.replace(/\s{2,}/g, " ");
    this.f.nombre.setValue(
      initalValue.replace(/[^ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]*/g, "")
    );
  }

  nameSerBlur(e) {
    let initalValue = this.f.nombre.value;
    this.f.nombre.setValue(initalValue.trim());
  }

  nombreAlert() {
    if (this.editMode === true) {
      if (this._service.newName !== "") {
        return true;
      }
      return false;
    }
  }

  changeCuenta(val) {
    let cta = this.cuentas.find((c) => c.id == val);
    this.simboloMoneda = cta.currency === "001" ? "S/" : "$";
    this.f.moneda.setValue(cta.currency);
  }

  calculateCommissions() {
    this.commissionAgentDollars =
      Math.round((this.commissionAgentSoles / this.tc) * 100) / 100;
    this.commissionStoreDollars =
      Math.round((this.commissionStoreSoles / this.tc) * 100) / 100;
  }

  showDiscardChanges(requireConfirm: boolean) {
    if (requireConfirm) {
      Swal.fire({
        title: "Descartar cambios",
        text: "Se van a descartar los cambios.",
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: "DESCARTAR",
        cancelButtonText: "SEGUIR EDITANDO",
        onOpen: drawPopup,
      }).then((r) => {
        if (r.value) {
          //this.afiliacionService.Descartar(this.indiceActual, this.stateCreate);
          this.afiliacionService.currentServiceModel = null;
          this.afiliacionService.currentIndex = -1;
          if (this.affiliationFlow == true) {
            this.router.navigate(["/resumenCobrosAfiliacion"]);
          } else {
            this.router.navigate(["/resumenCobros"]);
          }
        }
      });
    }
    /* else {
       this.afiliacionService.Descartar(this.indiceActual, this.stateCreate);
       this.Formulario = false;
       this.stateCreate = false;
       this.stateEdit =false;
       if (this.addNewAfterSave && this.indiceActual > 0) {
         setTimeout(() => this.MostarFormulario(), 600);
       }
       else if (this.sendAfterSave) {
         setTimeout(() => this.EnviarServicios(), 600);
       }
       this.indiceActual = -1;
       this.addNewAfterSave = false;
       this.sendAfterSave = false;
     } */
  }

  showAgencyChannel(show :boolean){
    this.useAgencyChannel = show;
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
