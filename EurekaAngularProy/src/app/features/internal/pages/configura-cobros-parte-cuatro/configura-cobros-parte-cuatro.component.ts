import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IServiceModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import {
  internalAuthFullRoutingNames,
  internalFullRoutingNames,
} from '../../internal-routing.names';

@Component({
  selector: 'cs-configura-cobros-parte-cuatro',
  templateUrl: './configura-cobros-parte-cuatro.component.html',
  styleUrls: ['./configura-cobros-parte-cuatro.component.scss'],
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
        filter: brightness(0.5);
      }
    `,
  ],
})
export class ConfiguraCobrosParteCuatroComponent implements OnInit {
  frm: UntypedFormGroup;
  editMode = false;
  affiliationFlow = false;
  _service: IServiceModel;
  cuentas: any[] = [];
  simboloMoneda = 'S/';
  submittedRequired = false;

  get f(): any {
    return this.frm.controls;
  }

  constructor(
    private router: Router,
    private afiliacionService: AfiliacionService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((d) => {
      this.affiliationFlow = d.affiliationFlow;
    });

    this.cuentas = [];

    this._service = Object.assign(
      {},
      this.afiliacionService.currentServiceModel
    );

    this.editMode =
      this._service.id !== null &&
      this._service.id !== undefined &&
      this._service.id > 0;

    this.frm = this.fb.group({
      idCuenta: new UntypedFormControl(
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
      let value: IServiceModel;
      value = this._service;

      value.idCuenta = this.frm.value.idCuenta
        ? this.frm.value.idCuenta
        : this.f.idCuenta.value;

      const cta = this.cuentas.find((c) => c.id === value.idCuenta);
      value.nroCuenta = `${cta.number.substr(0, 13)} (${
        cta.currency === '001' ? 'Soles' : 'Dólares'
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
  }

  onSave(nombre: string) {
    let nro = 1;

    this.afiliacionService.services.forEach((s, i) => {
      if (s.nombre !== null && s.nombre.startsWith(this.frm.value.nombre)) {
        if (
          !isNaN(parseInt(s.nombre.substr(this.frm.value.nombre.length))) ||
          s.nombre.substr(this.frm.value.nombre.length) === ''
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
    // }
  }

  nextPage() {
    if (this.affiliationFlow === true) {
      this.router.navigate([internalAuthFullRoutingNames.CHARGES_AFFILIATION]);
    } else {
      this.router.navigate([internalFullRoutingNames.CHARGES]);
    }
  }

  goBack() {
    if (this.affiliationFlow === true) {
      this.router.navigate([
        internalAuthFullRoutingNames.CHARGES_AFFILIATION_ADD_STEP_3,
      ]);
    } else {
      this.router.navigate([internalFullRoutingNames.CHARGES_ADD_STEP_3]);
    }
  }

  changeCuenta(val) {
    const cta = this.cuentas.find((c) => c.id == val);
    this.simboloMoneda = cta.currency === '001' ? 'S/' : '$';
    this.f.moneda.setValue(cta.currency);
  }
}
