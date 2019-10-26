import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ServiceModel } from 'src/app/shared/models';
import { DataServiceGTP } from 'src/app/shared/models/data-service-gtp';

@Component({
  selector: 'app-services-gtp',
  templateUrl: './services-gtp.component.html',
  styleUrls: ['./services-gtp.component.scss']
})
export class ServicesGTPComponent implements OnInit {
  private _service: ServiceModel;
  private _servicegtp: DataServiceGTP
  @Input() set service(value: DataServiceGTP){
    this._servicegtp = value;
    console.table(this._servicegtp);
  }
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    var montod = ((this._service.monto !== null && this._service.monto !== undefined) ? this._service.monto : '1.00');
    var porcentajed = ((this._service.porcentaje !== null && this._service.porcentaje !== undefined) ? this._service.porcentaje : '1.00'); 
    this.frm = this.fb.group({
      nombre: new FormControl({ value: this._service.nombre, disabled: true }, [Validators.required, Validators.minLength(3),Validators.pattern('^[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñA-Za-zÁÉÍÓÚáéíóú&  ]*$')]),
      codDeudor: new FormControl({ value: this._service.codDeudor, disabled: true }, [Validators.required]),
      nameCod: new FormControl({ value: this._service.nameCod, disabled: true}),
      tipoDato: new FormControl({ value: this._service.tipoDato, disabled: true }, Validators.required),
      tipoPago: new FormControl({ value: this._service.tipoPago, disabled: true }, Validators.required),
      idCuenta: [this._service.idCuenta, [Validators.required, Validators.minLength(13)]],
      moneda: [this._service.moneda, Validators.required],
      usaAgente: new FormControl({ value: this._service.usaAgente, disabled: true }),
      usaTienda: new FormControl({ value: this._service.usaTienda, disabled: true }),
      usaWebApp: new FormControl({ value: this._service.usaWebApp, disabled: true,}),
      cobraMora: [this._service.cobraMora, Validators.required],
      periodoMora: [this._service.periodoMora],
      tipoMora: [this._service.tipoMora],
      monto: new FormControl({ value: montod, disabled: true }),
      porcentaje: new FormControl({ value: porcentajed, disabled: true }),
      pagoPartes:[this._service.pagoPartes, Validators.required],
    });
  }

  get f(): any {
    return this.frm.controls;
  }


  frm: FormGroup;

}
