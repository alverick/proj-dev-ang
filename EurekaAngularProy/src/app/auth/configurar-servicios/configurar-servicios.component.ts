import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { RubroModel, MonedaModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { CustomValidators } from 'src/app/shared/services/custom.validators';
import Swal from 'sweetalert2';

export interface Animal {
  name: string;
  sound: string;
}
@Component({
  selector: 'app-configurar-servicios',
  templateUrl: './configurar-servicios.component.html',
  styleUrls: ['./configurar-servicios.component.scss']
})
export class ConfigurarServiciosComponent implements OnInit {

  Formulario: boolean =true;
  constructor(private afiliacionService: AfiliacionService, private fb: FormBuilder) { }

  ngOnInit() {
    this.Formulario =true;
    this.frm = this.fb.group({
      nombre: ['', Validators.required],
      rubro: ['', Validators.required],
      codDeudor: ['', Validators.required],
      tipoDato: ['', Validators.required],
      tipoPago: ['', Validators.required],
      nroCta: ['', Validators.required],
      moneda: ['', Validators.required],
      usaAgente: [false],
      usaTienda: [false],
      usaWebApp: [false],
      cobraMora: ['No', Validators.required],
      periodoMora: [''],
      tipoMora: ['M'],
      monto: [''],
      porcentaje: ['']
    });
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
    this.afiliacionService.GetCodDeudor().subscribe(d => this.codDeudor = d);
    this.afiliacionService.GetTipoDato().subscribe(d => this.tiposDato = d);
    this.afiliacionService.GetTipoPago().subscribe(d => this.tiposPago = d);
    this.afiliacionService.GetMoneda().subscribe(d => this.monedas = d);
    this.afiliacionService.GetPeriodoMora().subscribe(d => this.tiposMora = d);
  }

  frm: FormGroup;

  rubros: RubroModel[] = [];
  codDeudor: any[] = [];
  tiposDato: any[] = [];
  tiposPago: any[] = [];
  monedas: MonedaModel[] = [];
  tiposMora: any[] = [];

  simboloMoneda: string = 'S/';
  cobraMora: boolean = false;
  cobraMonto: boolean = true;
  cobraPorcentaje: boolean = false;

  get f() { return this.frm.controls; }

  OcultarFormulario(){
    this.Formulario = false 
  }
  MostarFormulario() {
    this.Formulario = true;
  }

  onSubmitServicio() {
    if (this.f.usaAgente.value === false && this.f.usaTienda.value === false && this.f.usaWebApp.value === false) {
      Swal.fire({ type: 'error', html: 'Debe escoger un medio de pago' });
      return;
    }
    if (this.frm.valid){
      console.log('registrar servicios');
    }
  }
  changeMoneda() {
    this.simboloMoneda = (this.f.moneda.value === "PEN" ? "S/" : "$");
  }
  changeMora() {
    this.cobraMora = this.f.cobraMora.value === 'Sí';
    if (this.cobraMora) {
      this.f.periodoMora.setValidators(Validators.required);
    } else {
      this.f.periodoMora.clearValidators();
      this.f.periodoMora.reset();
    }
  }
  changeTipoMora() {
    this.cobraMonto = this.f.tipoMora.value === "M";
    this.cobraPorcentaje = this.f.tipoMora.value === "P";
    if (this.cobraMonto) {
      this.f.monto.setValidators(Validators.required);
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.reset();
    } else if (this.cobraPorcentaje) {
      this.f.porcentaje.setValidators(Validators.required);
      this.f.monto.clearValidators();
      this.f.monto.reset();
    }
  }

}


