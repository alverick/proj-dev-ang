import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AfiliacionService } from "src/app/shared/services/afiliacion.service";
import { MonedaModel, ServiceModel } from "src/app/shared/models";
import Swal from "sweetalert2";

@Component({
  selector: 'app-form-servicio',
  templateUrl: './form-servicio.component.html',
  styleUrls: ['./form-servicio.component.scss']
})
export class FormServicioComponent implements OnInit {
  constructor(private afiliacionService: AfiliacionService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.frm = this.fb.group({
      nombre: [this._service.nombre, Validators.required],
      codDeudor: [this._service.codDeudor, Validators.required],
      tipoDato: [this._service.tipoDato, Validators.required],
      tipoPago: [this._service.tipoPago, Validators.required],
      nroCuenta: [this._service.nroCuenta, Validators.required],
      moneda: [this._service.moneda, Validators.required],
      usaAgente: [this._service.usaAgente],
      usaTienda: [this._service.usaTienda],
      usaWebApp: [this._service.usaWebApp],
      cobraMora: [this._service.cobraMora, Validators.required],
      periodoMora: [this._service.periodoMora],
      tipoMora: [this._service.tipoMora],
      monto: [this._service.monto],
      porcentaje: [this._service.porcentaje]
    });
    this.afiliacionService.GetCodDeudor().subscribe(d => this.codDeudor = d);
    this.afiliacionService.GetTipoDato().subscribe(d => this.tiposDato = d);
    this.afiliacionService.GetTipoPago().subscribe(d => this.tiposPago = d);
    this.afiliacionService.GetMoneda().subscribe(d => this.monedas = d);
    this.afiliacionService.GetPeriodoMora().subscribe(d => this.tiposMora = d);
    this.changeMora();
    this.changeTipoMora();
  }

  frm: FormGroup;

  codDeudor: any[] = [];
  tiposDato: any[] = [];
  tiposPago: any[] = [];
  monedas: MonedaModel[] = [];
  tiposMora: any[] = [];

  simboloMoneda: string = 'S/';
  cobraMora: boolean = false;
  cobraMonto: boolean = true;
  cobraPorcentaje: boolean = false;

  private _service: ServiceModel;

  @Input() set service(value: ServiceModel) {
    if (value === null || value === undefined) {
      this._service = {
        nombre: '',
        rubro: null,
        codDeudor: null,
        tipoDato: '',
        tipoPago: null,
        nroCuenta: '',
        moneda: '',
        usaAgente: false,
        usaTienda: false,
        usaWebApp: false,
        cobraMora: 'N',
        periodoMora: null,
        tipoMora: 'M'
      }
      this.simboloMoneda = 'S/';
    }
    else {
      this._service = value;
      this.simboloMoneda = value.simboloMoneda
      delete this._service.simboloMoneda;
    }
  }
  @Output() grabar = new EventEmitter<any>();

  get f() {
    return this.frm.controls;
  }

  onSubmitServicio() {
    if (this.frm.valid) {
      if (this.f.usaAgente.value === false && this.f.usaTienda.value === false && this.f.usaWebApp.value === false) {
        Swal.fire({ type: 'error', html: 'Debe escoger un medio de pago' });
      }
      else {
        let value: ServiceModel = this.frm.value;
        value.simboloMoneda = this.simboloMoneda;
        this.grabar.emit(value);
      }
    }
  }

  changeMoneda() {
    this.simboloMoneda = (this.f.moneda.value === "001" ? "S/" : "$");
  }

  changeMora() {
    this.cobraMora = (this.f.cobraMora.value === 'S');
    if (this.cobraMora) {
      this.f.periodoMora.setValidators(Validators.required);
    } else {
      this.f.periodoMora.clearValidators();
      this.f.periodoMora.reset();
    }
  }

  changeTipoMora() {
    this.cobraMonto = (this.f.tipoMora.value === "M");
    this.cobraPorcentaje = (this.f.tipoMora.value === "P");
    if (this.cobraMora && this.cobraMonto) {
      this.f.monto.setValidators(Validators.required);
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.reset();
    } else if (this.cobraMora && this.cobraPorcentaje) {
      this.f.porcentaje.setValidators(Validators.required);
      this.f.monto.clearValidators();
      this.f.monto.reset();
    }
  }
}
