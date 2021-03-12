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

@Component({
  selector: "app-configura-cobros-parte-cuatro",
  templateUrl: "./configura-cobros-parte-cuatro.component.html",
  styleUrls: ["./configura-cobros-parte-cuatro.component.scss"],
})
export class ConfiguraCobrosParteCuatroComponent implements OnInit {
  frm: FormGroup;
  editMode: boolean = false;
  _service: ServiceModel;
  cuentas: any[] = [];
  simboloMoneda: string = "S/";
  submittedRequired = false;

  get f(): any {
    return this.frm.controls;
  }

  constructor(
    private router: Router,
    private afiliacionService: AfiliacionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.cuentas = [];
    //this.editMode = this.afiliacionService.editMode;

    this._service = Object.assign(
      {},
      this.afiliacionService.currentServiceModel
    );

    this.editMode = this._service.id !== null && this._service.id !== undefined && this._service.id > 0;

    this.frm = this.fb.group({
      idCuenta: new FormControl(
        { value: this._service.idCuenta.toString(), disabled: this.editMode },
        Validators.required
      ),
      moneda: [this._service.moneda, Validators.required],
    });

    this.afiliacionService.GetCards().subscribe((d) => {
      this.cuentas = d;
    });
  }

  onSubmitServicio() {
    this.submittedRequired = true;
    if (this.frm.valid) {
      let value: ServiceModel;
      value = this._service;

      //if (this.editMode) {
      if (this.frm.value.idCuenta) value.idCuenta = this.frm.value.idCuenta;
      else value.idCuenta = this.f.idCuenta.value;
      //}

      let cta = this.cuentas.find((c) => c.id === value.idCuenta);
      value.nroCuenta = `${cta.number.substr(0, 13)} (${
        cta.currency === "001" ? "Soles" : "Dólares"
      })`;
      value.moneda = this.frm.value.moneda;
      value.simboloMoneda = this.simboloMoneda;

      this.setCurrentServiceModel(
        value.idCuenta,
        value.nroCuenta,
        value.simboloMoneda,
        value.moneda
      );
      this.onSave(value.nombre);
      this.nextPage();
    }
  }

  setCurrentServiceModel(
    idCuenta: string,
    nroCuenta: string,
    simboloMoneda: string,
    moneda: string
  ) {
    this.afiliacionService.currentServiceModel.idCuenta = idCuenta;
    this.afiliacionService.currentServiceModel.nroCuenta = nroCuenta;
    this.afiliacionService.currentServiceModel.simboloMoneda = simboloMoneda;
    this.afiliacionService.currentServiceModel.moneda = moneda;
    console.log(this.afiliacionService.currentServiceModel);
  }

  onSave(nombre: string){
    //if (this.afiliacionService.currentIndex >= 0) {
    //} else {
      let nro = 1;

      this.afiliacionService.services.forEach((s, i) => {
        if (s.nombre !== null && s.nombre.startsWith(this.frm.value.nombre)) {
          if (
            !isNaN(
              parseInt(s.nombre.substr(this.frm.value.nombre.length))
            ) ||
            s.nombre.substr(this.frm.value.nombre.length) === ""
          ) {
            nro += 1;
          }
        }
      });

      if (nro > 1) {
        nombre += nro.toString();
      }

      this.afiliacionService.addCurrentServiceModel();
      this.nextPage();
    //}
  }

  nextPage() {
    this.router.navigate(["/resumenCobrosAfiliacion"]);
  }

  goBack() {
    this.router.navigate(["/configuraCobrosParteTres"]);
  }

  changeCuenta(val) {
    let cta = this.cuentas.find((c) => c.id == val);
    this.simboloMoneda = cta.currency === "001" ? "S/" : "$";
    this.f.moneda.setValue(cta.currency);
  }
}
