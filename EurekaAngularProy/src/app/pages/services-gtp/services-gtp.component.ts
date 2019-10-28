import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ServiceModel, MonedaModel } from 'src/app/shared/models';
import { DataServiceGTP } from 'src/app/shared/models/data-service-gtp';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { GtpService } from 'src/app/shared/services/gtp.service';

@Component({
  selector: 'app-services-gtp',
  templateUrl: './services-gtp.component.html',
  styleUrls: ['./services-gtp.component.scss']
})
export class ServicesGTPComponent implements OnInit {
  codDeudor: any[] = [];
  tiposDato: any[] = [];
  tiposPago: any[] = [];
  monedas: MonedaModel[] = [];
  tiposMora: any[] = [];
  cuentas: any[] = [];
  simboloMoneda: string = 'S/';
  cobraMora: boolean = false;
  cobraMonto: boolean = true;
  cobraPorcentaje: boolean = false;
  cmoraporce: boolean = false;
  public Dataparcial: boolean = true;
  private _service:   DataServiceGTP;
  configEmpresaService: any;

  @Input() set service(value: DataServiceGTP){
    this._service = value;
    console.log(value);
  }
  @Output() grabar = new EventEmitter<any>();

  constructor(private fb: FormBuilder,private afiliacionService: AfiliacionService,public gtpService:GtpService) { }

  frm: FormGroup;
  ngOnInit() {
    var montod = ((this._service.monto !== null && this._service.monto !== undefined) ? this._service.monto : '1.00');
    var porcentajed = ((this._service.porcentaje !== null && this._service.porcentaje !== undefined) ? this._service.porcentaje : '1.00');
    this.frm = this.fb.group({
      nombre: new FormControl({ value: this._service.nombre, disabled: true }, [Validators.required, Validators.minLength(3),Validators.pattern('^[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñA-Za-zÁÉÍÓÚáéíóú&  ]*$')]),
      codDeudor: new FormControl({ value: this._service.codDeudor, disabled: true }, [Validators.required]),
      nameCod: new FormControl({ value: this._service.nameCod, disabled: true}),
      tipoDato: new FormControl({ value: this._service.tipoDato, disabled: true }, Validators.required),
      tipoPago: new FormControl({ value: this._service.tipoPago, disabled: true }, Validators.required),
      idCuenta:new FormControl({ value: this._service.idCuenta, disabled: true }, Validators.required),
      moneda: [this._service.moneda, Validators.required],
      usaAgente: new FormControl({ value: this._service.usaAgente, disabled: true }),
      usaTienda: new FormControl({ value: this._service.usaTienda, disabled: true }),
      usaWebApp: new FormControl({ value: this._service.usaWebApp, disabled: true,}),
      cobraMora: new FormControl({ value: this._service.cobraMora, disabled: true }),
      periodoMora: new FormControl({ value: this._service.periodoMora, disabled: true }, [Validators.required]),
      tipoMora: ({ value: this._service.tipoMora, disabled: true }) ,
      monto: new FormControl({ value: montod, disabled: true }),
      porcentaje: new FormControl({ value: porcentajed, disabled: true }),
      pagoPartes: new FormControl({ value: this._service.pagoPartes, disabled: true }),
      NewNameCod:  [(this._service.NewNameCod == true? 'S':'N'), Validators.required],
      NewName:  [(this._service.NewName == true? 'S':'N'), Validators.required],
    });

    this.afiliacionService.GetCodDeudor().subscribe(d => this.codDeudor = d);
    this.afiliacionService.GetTipoDato().subscribe(d => this.tiposDato = d);
    this.afiliacionService.GetTipoPago().subscribe(d => this.tiposPago = d);
    this.afiliacionService.GetMoneda().subscribe(d => this.monedas = d);
    this.afiliacionService.GetPeriodoMora().subscribe(d => this.tiposMora = d);
    this.afiliacionService.GetCards().subscribe(d => this.cuentas = d);

    if (this.frm.get('cobraMora').value === 'S') {
      this.cmoraporce = true;
   }
    if (this.frm.get('cobraMora').value === 'N') {
     this.frm.get('periodoMora').setValue('');
     this.cmoraporce = false;
    }

    // combo para ocultar si es data parcial
    if (this.frm.get('tipoDato').value === 'P') {
      /* this.frm.get('tipoPago').setValue('C');
      this.tiposPago.pop();*/
      this.Dataparcial = false;

   } else {
     this.Dataparcial = true;
   }

  }

  get f(): any {
    return this.frm.controls;
  }

  onSubmitServicio(){
    if (this.frm.valid)
      {
          let value: DataServiceGTP;
          value = this._service;
          value.NewName = (this.frm.value.NewName =='S');
          value.NewNameCod = (this.frm.value.NewNameCod =='S');
          this.grabar.emit(value);
      }
  }

  nameSerInput(e) { }

  nameSerBlur(e) { }

  onChangeTipoDato() { }

  changeCuenta(e) { }
}
