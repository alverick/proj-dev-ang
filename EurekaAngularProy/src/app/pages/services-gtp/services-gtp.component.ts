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
  inReview: boolean;
  private _service:   DataServiceGTP;
  configEmpresaService: any;

  @Input() set service(value: DataServiceGTP) {
    this._service = value;
    console.log(value);
  }
  @Output() grabar = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private afiliacionService: AfiliacionService, public gtpService: GtpService) { }

  frm: FormGroup;
  ngOnInit() {
    this.inReview = this._service.inReview;
    var montod = ((this._service.amount !== null && this._service.amount !== undefined) ? this._service.amount : '1.00');
    var porcentajed = ((this._service.porcentage !== null && this._service.porcentage !== undefined) ? this._service.porcentage : '1.00');
    this.frm = this.fb.group({
      nombre: new FormControl({ value:  (this._service.name === '?') ?
      ( ((this._service.newName.substring(0, 3) === '???')?
      (this._service.newName.substring(3, this._service.newName.length)):this._service.newName)):((this._service.name === this._service.newName)? this._service.name : this._service.newName ) , disabled: true },
        [Validators.required, Validators.minLength(3),
        Validators.pattern('^[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñA-Za-zÁÉÍÓÚáéíóú&  ]*$')]),
      codDeudor: new FormControl({ value: (this._service.debtorCode   === 'RUC' ||  this._service.debtorCode  === 'DNI' ||
      this._service.debtorCode === 'Codigo Interno') ? this._service.debtorCode : 'Otro', disabled: true }, [Validators.required]),
      nameCod: new FormControl({ value: (this._service.debtorCode === '?')?
      (( (this._service.newNameCode.substring(0,3) === '???')?
      (this._service.newNameCode.substring(3, this._service.newNameCode.length)): this._service.newNameCode)) : (this._service.debtorCode === this._service.newNameCode)? this._service.debtorCode :this._service.newNameCode , disabled: true}),

      tipoDato: new FormControl({ value: this._service.dataType, disabled: true }, Validators.required),
      tipoPago: new FormControl({ value: this._service.paymentType, disabled: true }, Validators.required),
      idCuenta: new FormControl({ value: this._service.idAccount, disabled: true }, Validators.required),
      moneda: [this._service.currency, Validators.required],
      usaAgente: new FormControl({ value: this._service.useAgent, disabled: true }),
      usaTienda: new FormControl({ value: this._service.useStore, disabled: true }),
      usaWebApp: new FormControl({ value: this._service.useAppWeb, disabled: true}),
      cobraMora: new FormControl({ value: this._service.chargeInterest, disabled: true }),
      periodoMora: new FormControl({ value: this._service.chargeType, disabled: true }, [Validators.required]),
      tipoMora: ({ value: this._service.interestType, disabled: true }) ,
      monto: new FormControl({ value: montod, disabled: true }),
      porcentaje: new FormControl({ value: porcentajed, disabled: true }),
      pagoPartes: new FormControl({ value: this._service.partialPayment, disabled: true }),
      NewNameCod:  [(this._service.acceptednewNameCode == true? 'S':'N'), Validators.required],
      NewName:  [(this._service.acceptednewName == true? 'S':'N'), Validators.required],
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

  RadioAprovveName() {
    if ( (this._service.name  !== this._service.newName  ) ){
      return true;
    }
    if (( this._service.inReview && this._service.name !== '?') && (this._service.name  !== this._service.newName  )) {
      return true;
    }
    if (( this._service.inReview && this._service.name === '?') && (this._service.name  !== this._service.newName  )) {
      return true;
    }
    if ( this._service.newName.substring(0, 3) === '???') {
      return false;
    }
  }
  RadioAprovveNameCod() {
    if ( (this._service.debtorCode  !== this._service.newNameCode  )) {
      return true;
    }
    if (( this._service.inReview && this._service.debtorCode !== '?') && (this._service.debtorCode  !== this._service.newNameCode  )) {
      return true;
    }
    if (( this._service.inReview && this._service.debtorCode === '?') && (this._service.debtorCode  !== this._service.newNameCode  )) {
      return true;
    }
    if ( this._service.newNameCode.substring(0, 3) === '???') {
      return false;
    }
  }

  Button() {
    if((this._service.name  !== this._service.newName  ) || (this._service.debtorCode  !== this._service.newNameCode  )){
      return true;
    }
    if((( this._service.inReview && this._service.name === '?') && (this._service.name  !== this._service.newName  )) ||  (( this._service.inReview && this._service.debtorCode === '?') && (this._service.debtorCode  !== this._service.newNameCode  ))){
      return true;
    }
    if((( this._service.inReview && this._service.name !== '?') && (this._service.name  !== this._service.newName  )) ||  (( this._service.inReview && this._service.debtorCode !== '?') && (this._service.debtorCode  !== this._service.newNameCode  ))){
      return true;
    }
    if( ( this._service.newNameCode.substring(0, 3) === '???') || ( this._service.newName.substring(0, 3) === '???')){
      return false;
    }
  }

  onSubmitServicio() {
    if (this.frm.valid) {
          let value: DataServiceGTP;
          value = this._service;
         // value.acceptednewName = (this.frm.value.NewName === 'S');
         // value.acceptednewNameCode = (this.frm.value.NewNameCod === 'S') ;
          // tslint:disable-next-line:max-line-length
          value.acceptednewName = (this._service.name  !== this._service.newName) ? ((this.frm.value.NewName === 'S') ? true : false) : true;
          // tslint:disable-next-line:max-line-length
          value.acceptednewNameCode = (this._service.debtorCode !== this._service.newNameCode ) ? ( (this.frm.value.NewNameCod === 'S') ? true : false) : true ;
          this.grabar.emit(value);
      }
  }

  nameSerInput(e) { }

  nameSerBlur(e) { }

  onChangeTipoDato() { }

  changeCuenta(e) { }
}
