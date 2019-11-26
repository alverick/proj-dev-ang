import { Component, OnInit, Input, Output, EventEmitter, ɵConsole } from '@angular/core';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceModel, MonedaModel } from 'src/app/shared/models';
import { drawPopup } from 'src/app/shared/services/popups';
import Swal from 'sweetalert2';
import { ConfigurarGtpComponent } from '../configurar-gtp/configurar-gtp.component';

@Component({
  selector: 'app-form-servicio-gtp',
  templateUrl: './form-servicio-gtp.component.html',
  styleUrls: ['./form-servicio-gtp.component.scss']
})
export class FormServicioGtpComponent implements OnInit {
  public createMode: boolean = false;
  public editMode: boolean = false;
  public gtpMode: boolean = false;
  public Dataparcial: boolean = true;

  public codDeu: String;

  constructor(private afiliacionService: AfiliacionService,
    private fb: FormBuilder, stateEdit: ConfigurarGtpComponent ) {
      stateEdit.onFormAction.subscribe(e => this.formAction(e));
    }

  @Input() set service(value: ServiceModel) {
      this._service = value;
      this.simboloMoneda = value.simboloMoneda;
      this._service.simboloMoneda = this.simboloMoneda;
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
  simboloMoneda: string = 'S/';
  cobraMora: boolean = false;
  cobraMonto: boolean = true;
  cobraPorcentaje: boolean = false;
  cmoraporce: boolean = false;
  private _service: ServiceModel;
  @Output() grabar = new EventEmitter<any>();
  public services: ServiceModel[] = [];


  ngOnInit(): void {

    this.editMode = (this._service.id !== null && this._service.id !== undefined && this._service.id > 0);
    this.gtpMode = false;
    this.codDeu = (this._service.codDeudor == null || this._service.codDeudor === '' ) ? this._service.nameCod : this._service.codDeudor;

    var montod = ((this._service.monto !== null && this._service.monto !== undefined) ? this._service.monto : '1.00');
    var porcentajed = ((this._service.porcentaje !== null && this._service.porcentaje !== undefined) ? this._service.porcentaje : '1.00');

    console.log(this._service);
    let debtorCode = this._service.newNameCode;
    let nameCode = '';
    if (debtorCode != 'DNI' && debtorCode != 'RUC' && debtorCode != 'Codigo Interno') {
      nameCode = debtorCode;
      debtorCode = 'Otro';
    }

    this.frm = this.fb.group({
        res: [this._service.res, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(7)]],
        nombre: new FormControl({ value: (this._service.nombre !== '?')? this._service.nombre : this._service.newName,
          disabled: false },
          [Validators.required, Validators.minLength(3), Alfanumerico,
            Validators.pattern('^[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñA-Za-zÁÉÍÓÚáéíóú&  ]*$')]),
        codDeudor: new FormControl({ value: debtorCode, disabled: false }, [Validators.required]),
        nameCod: new FormControl({ value: nameCode, disabled: false }),
        tipoDato: new FormControl({ value: this._service.tipoDato, disabled: this.gtpMode }, Validators.required),
        tipoPago: new FormControl({ value: this._service.tipoPago, disabled: this.gtpMode }, Validators.required),
        nroCuenta: [this._service.nroCuenta, [Validators.required, Validators.minLength(13)]],
        moneda: [this._service.moneda, Validators.required],
        usaAgente: new FormControl({ value: this._service.usaAgente, disabled: this.gtpMode}),
        usaTienda: new FormControl({ value: this._service.usaTienda, disabled: this.gtpMode }),
        usaWebApp: new FormControl({ value: this._service.usaWebApp, disabled: this.gtpMode}),
        cobraMora: new FormControl({ value: this._service.cobraMora, disabled: false }, Validators.required ),
        periodoMora:new FormControl({ value: this._service.periodoMora, disabled: false }),
        tipoMora: new FormControl({ value: this._service.tipoMora, disabled: false }),
        monto: new FormControl({ value: montod, disabled: false }),
        porcentaje: new FormControl({ value: porcentajed, disabled: false }),
        pagoPartes: new FormControl({ value: this._service.pagoPartes, disabled: false }, Validators.required),
      });

    this.afiliacionService.GetCodDeudor().subscribe(d => this.codDeudor = d);
    this.afiliacionService.GetTipoDato().subscribe(d => this.tiposDato = d);
    this.afiliacionService.GetTipoPago().subscribe(d => this.tiposPago = d);
    this.afiliacionService.GetMoneda().subscribe(d => this.monedas = d);
    this.afiliacionService.GetPeriodoMora().subscribe(d => this.tiposMora = d);
    this.afiliacionService.GetCards().subscribe(d => this.cuentas = d);
    this.changeMora(false);
    this.changeTipoMora(false);


    if (this.frm.get('cobraMora').value === 'N') {
     this.frm.get('periodoMora').setValue('');
     this.cmoraporce = false;
    }
    if (this.frm.get('cobraMora').value === 'S') {
       this.cmoraporce = true;
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

  nombreAlert() {
    /*editMode === true && ( _service.nombre  !== _service.newName) */
    return (this._service.nombre === '?' && this._service.newName.substring(0, 3) === '???') ? false : true;
  }
  CodiAlert() {
    return (this._service.codDeudor === '?' && this._service.newNameCode.substring(0, 3) === '???' ) ? false :  true;
  }



  onChangeTipoDato() {
    if (this.frm.get('tipoDato').value === 'P') {
     /* this.frm.get('tipoPago').setValue('C');
      this.tiposPago.pop();*/
      this.Dataparcial = false;
      // cobraMora
      this.frm.get('cobraMora').setValue('N');
      this.frm.get('pagoPartes').setValue('N');

      this.frm.get('monto').setValue('1.00');
      this.frm.get('porcentaje').setValue('1.00');
      this.cmoraporce = false;
      this.cobraMora = false;
    }else{
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
    if (this.frm.valid) {

            let value: ServiceModel;

            value = this._service;

            value.res = this.frm.value.res;
            value.newName = this.frm.value.nombre;
            value.newNameCode = (this.frm.value.codDeudor === 'Otro' ? this.frm.value.nameCod : this.frm.value.codDeudor);
            value.tipoDato = this.frm.value.tipoDato;
            value.tipoPago = this.frm.value.tipoPago;
            value.nroCuenta = this.frm.value.nroCuenta;
            value.moneda = this.frm.value.moneda;
            value.usaAgente = this.frm.value.usaAgente;
            value.usaTienda = this.frm.value.usaTienda;
            value.usaWebApp = true;
            value.cobraMora = this.frm.value.cobraMora;
            value.periodoMora = this.frm.value.periodoMora;
            value.tipoMora = this.frm.value.tipoMora;
            value.monto = this.frm.value.monto;
            value.porcentaje = this.frm.value.porcentaje;
            value.pagoPartes = this.frm.value.pagoPartes;
            value.acceptednewName = true;
            value.acceptednewNameCode = true;
            value.inReview = false;
            console.log(value);
            console.log('emitir grabar');
            this.grabar.emit(value);

    }
  }

  changeMoneda(event) {
    console.log('hola '+ event);
    this.simboloMoneda = (this.f.moneda.value === "001" ? "S/" : "$");
  }

  changeCuenta(val) {
    let cta = this.cuentas.find(c => c.id == val);
    this.simboloMoneda = (cta.currency === '001' ? 'S/' : '$');
    this.f.moneda.setValue(cta.currency);
  }

  TipoCobro() {
    if ( this.frm.get('periodoMora').value === '1' || this.frm.get('periodoMora').value === '2') {
          this.cmoraporce = true;
    }else {
      this.cmoraporce = false;
    }
  }
 Codigo(event){
    if(event === 'Otro'){
      this.f.nameCod.setValidators([Validators.required, Validators.minLength(3)]);
    }
    else {
      this.f.nameCod.clearValidators();
      this.f.nameCod.reset();
    }
  }

  changeMora(changeData: boolean = true) {

    this.cobraMora = (this.f.cobraMora.value === 'S');
    console.log(this.f.cobraMora.value);
    if (this.cobraMora) {

      this.f.periodoMora.setValidators([Validators.required]);
      this.f.monto.enable();
      this.f.monto.setValidators([Validators.required, Validators.pattern('^([0-9]{1,4})?(\.[0-9]{1,2})?$'), Minimo(1), Maximo(1000)])
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      if (changeData) {
        this.f.porcentaje.reset("1.00");
      }

    } else {
      console.log('entra en no');
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
     this.cobraMonto = (this.f.tipoMora.value === "M");
     this.cobraPorcentaje = (this.f.tipoMora.value === "P");
    if (this.cobraMora && this.cobraMonto) {
      this.f.monto.enable();
      this.f.monto.setValidators([Validators.required,Validators.pattern('^([0-9]{1,4})?(\.[0-9]{1,2})?$'), Minimo(1), Maximo(1000)]);
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      if(changeData) {
        this.f.porcentaje.reset("1.00");
      }
    } else if (this.cobraMora && this.cobraPorcentaje) {
      this.f.porcentaje.enable();
      this.f.porcentaje.setValidators([Validators.required, Validators.pattern('^([0-9]{1,4})?(\.[0-9]{1,2})?$'), Minimo(0.01), Maximo(100)]);
      this.f.monto.clearValidators();
      this.f.monto.disable();
      if(changeData) {
        this.f.monto.reset("1.00");
      }
    }
  }

  selectCodigo(event){
    if(event === 'Otro'){
    //  this.f.codDeudor.reset();
      this.f.nameCod.setValidators([Validators.required, Validators.minLength(3)]);
    }
    else {
      this.f.nameCod.clearValidators();
      this.f.nameCod.reset();
    }
  }

  formAction(action: string){
    if (action === 'save') {
      Object.keys(this.frm.controls).forEach(c => {
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
    this.f.nameCod.setValue(initalValue.replace(/[^ 0-9-A-Z-a-z]*/g, ''));
  }

  resInput(e) {
    let initalValue = this.f.res.value;
    this.f.res.setValue(initalValue.replace(/[^0-9]/g, ''));
  }

  MoraMontoBlur(e) {
    let initalValue = parseFloat(this.f.monto.value) ;
    if(!isNaN(initalValue))
    this.f.monto.setValue(initalValue.toFixed(2));

  }
  MoraPorcenBlur(e){
    let initalValue = parseFloat(this.f.porcentaje.value);
    if(!isNaN(initalValue))
    this.f.porcentaje.setValue(initalValue.toFixed(2));

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
    this.f.nombre.setValue(initalValue.replace(/[^ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]*/g, ''));
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
  }
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
  }
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
  let numero= /[0-9]/g
  let raro= /[-{1,}]-?/g;
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
