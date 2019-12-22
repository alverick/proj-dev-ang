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

/*
  @Input() set service(value: ServiceModel) {
       this._service = value;
       this.simboloMoneda = value.simboloMoneda;
       this._service.simboloMoneda = this.simboloMoneda;
   }
 */

  @Output() grabar = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private afiliacionService: AfiliacionService, public gtpService: GtpService) { }

  frm: FormGroup;
  ngOnInit() {
  //  console.log('el servivio elegido en apro '+this._service.useAppWeb + this._service.useAgent );
 // console.table( this._service);
    console.log('nombre ser aprobado ' + this._service.acceptednewName);
    this.inReview = this._service.inReview;
    var montod = ((this._service.amount !== null && this._service.amount !== undefined) ? this._service.amount : '1.00');
    var porcentajed = ((this._service.porcentage !== null && this._service.porcentage !== undefined) ? this._service.porcentage : '1.00');
    this.frm = this.fb.group({
       nombre :  new FormControl({value: (this._service.newNameGTPStatus === 0 || this._service.newNameGTPStatus === 2 || this._service.newNameGTPStatus === 3) ? this._service.newName : this._service.name , disabled: true  },
       [Validators.required, Validators.minLength(3), Validators.pattern('^[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñA-Za-zÁÉÍÓÚáéíóú&  ]*$')]),
    /*  nombre: new FormControl({ value:  (this._service.name === '?') ?
      ( ((this._service.newName.substring(0, 3) === '???')?
      (this._service.newName.substring(3, this._service.newName.length)):this._service.newName)):((this._service.name === this._service.newName)? this._service.name : this._service.newName ) , disabled: true },
        [Validators.required, Validators.minLength(3),
        Validators.pattern('^[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñA-Za-zÁÉÍÓÚáéíóú&  ]*$')]), */

      codDeudor: new FormControl({ value: (this._service.debtorCode   === 'RUC' ||  this._service.debtorCode  === 'DNI' ||
      this._service.debtorCode === 'Codigo Interno') ? this._service.debtorCode : 'Otro', disabled: true }, [Validators.required]),

      // tslint:disable-next-line:max-line-length
      // nameCods: new FormControl ({ value: ( this._service.newNameCodeGtpStatus === 0  || this._service.newNameCodeGtpStatus === 2 })? this._service.newNameCode : this._service.debtorCode     , disabled: true}),

    /*  nameCod: new FormControl({ value: (this._service.debtorCode === '?')?
      (( (this._service.newNameCode.substring(0,3) === '???')?
      (this._service.newNameCode.substring(3, this._service.newNameCode.length)): this._service.newNameCode)) : (this._service.debtorCode === this._service.newNameCode)? this._service.debtorCode :this._service.newNameCode , disabled: true}), */
      nameCod: new FormControl({ value:  (this._service.codDeudor === null) ? this._service.newNameCode : (this._service.codDeudor === 'Otro') ?
      this._service.nameCod : this._service.codDeudor, disabled: true}),
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
      // tslint:disable-next-line:max-line-length
      NewNameCod:  [ (this._service.acceptednewNameCode === null) ? '' : (this._service.acceptednewNameCode === true ? 'S' : 'N'), Validators.required],
      // tslint:disable-next-line:max-line-length
      NewName:  [(this._service.acceptednewName === null) ? '' : (this._service.acceptednewName === true ? 'S' : 'N'), Validators.required],
    });
    this.changeMora(false);
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


  RadioAprovveName2() {
  //  console.log('llegas aca');
    if (this._service.name  === this._service.newName  ) {
      //console.log('se activo la limieza 1.1');
      // this.f.NewName.clearValidators();
      return false;
    }
    if ( (this._service.name === '?' && this._service.newName.substring(0, 3) === '???' )){
    //  console.log('se activo la limieza 1.2');
      // this.f.NewName.clearValidators();
      return false;
    }
    if (( this._service.name === '?')) {
       return true;
    }

    if (this._service.name  !== this._service.newName  ) {
       return true;
    }
    if (( this._service.inReview && this._service.name === '?') && (this._service.newName.substring(0, 3) !== '???' )) {
      return true;
    }
  }

    RadioAprovveName() {
      if (this._service.newNameGTPStatus === 1  ) {
        return false;
      }
      if (this._service.newNameGTPStatus === 3 ) {
        return false;
      }
      if (this._service.newNameGTPStatus === 0 ) {
        return true;
      }
      if (this._service.newNameGTPStatus === 2  ) {
        return true;
      }
    }

  RadioAprovveNameCod2() {
    if (this._service.debtorCode  === this._service.newNameCode ) {
      return false;
    }
    if ( this._service.debtorCode === '?'  && this._service.newNameCode.substring(0, 3) === '???') {
      return false;
    }
    if (( this._service.debtorCode === '?')  ) {
      return true;
    }
    if (this._service.debtorCode  !== this._service.newNameCode ){
       return true;
    }
    if (( this._service.inReview && this._service.debtorCode === '?') && (this._service.newNameCode.substring(0, 3) !== '???')) {
      return true;
    }
  }

   RadioAprovveNameCod() {
    if (this._service.newNameCodeGTPStatus === 1 ) {
      return false;
    }
    if (this._service.newNameCodeGTPStatus === 3 ) {
      return false;
    }
    if (this._service.newNameCodeGTPStatus === 0) {
      return true;
    }
    if (this._service.newNameCodeGTPStatus === 2) {
      return true;
    }
  }
  Button2() {

    if ((this._service.name  === this._service.newName  ) &&  (this._service.debtorCode  === this._service.newNameCode ) ) {
      return false;
    }
    if ( (this._service.name === '?' && this._service.newName.substring(0, 3) === '???' )||   ( this._service.debtorCode === '?'  && this._service.newNameCode.substring(0, 3) === '???') ){
      return false;
    }
    if (( this._service.name === '?') || ( this._service.debtorCode === '?') ) {
      return true;
    }
    if ((this._service.name  !== this._service.newName  ) ||  (this._service.debtorCode  !== this._service.newNameCode  )) {
      return true;
    }
    if ((( this._service.inReview && this._service.name === '?') && (this._service.newName.substring(0, 3) !== '???' )) || (( this._service.inReview && this._service.debtorCode === '?') && (this._service.newNameCode.substring(0, 3) !== '???'))) {
      return true;
    }
  }

  Button() {
    if ((this._service.newNameGTPStatus === 1  ) && (this._service.newNameCodeGTPStatus === 1 )) {
      return false;
    }
    if ((this._service.newNameGTPStatus === 3 ) || (this._service.newNameCodeGTPStatus === 3 ) )  {
      return false;
    }
    if ((this._service.newNameGTPStatus === 0) || (this._service.newNameCodeGTPStatus === 0)) {
      return true;
    }
    if ((this._service.newNameGTPStatus === 2) || (this._service.newNameCodeGTPStatus === 2 )) {
      return true;
    }
  }

 /* onSubmitServicio2() {

    if (this._service.newNameGtpStatus === 1   ) {
      console.log('se activo la limieza 1.1');
      this.f.NewName.clearValidators();
      this.f.NewName.reset();
     }
    if ( (this._service.name === '?' && this._service.newName.substring(0, 3) === '???' )){
      console.log('se activo la limieza 1.2');
      this.f.NewName.clearValidators();
      this.f.NewName.reset();
     }
    // CODIGO DEUDOR
      if (this._service.debtorCode  === this._service.newNameCode ) {
      console.log('se activo la limieza 2.1');
      this.f.NewNameCod.clearValidators();
      this.f.NewNameCod.reset();
      }
      if ( this._service.debtorCode === '?'  && this._service.newNameCode.substring(0, 3) === '???') {
        console.log('se activo la limieza 2.2');
        this.f.NewNameCod.clearValidators();
        this.f.NewNameCod.reset();
       }

    if (this.frm.valid) {
      console.log('el form es valido');
          let value: DataServiceGTP;
          value = this._service;
         // value.acceptednewName = (this.frm.value.NewName === 'S');
         // value.acceptednewNameCode = (this.frm.value.NewNameCod === 'S') ;
          // tslint:disable-next-line:max-line-length
          value.acceptednewName = (this._service.name  !== this._service.newName) ? ((this.frm.value.NewName === 'S') ? true : false) : true;
          // tslint:disable-next-line:max-line-length
          value.acceptednewNameCode = (this._service.debtorCode !== this._service.newNameCode ) ? ( (this.frm.value.NewNameCod === 'S') ? true : false) : true ;
          this.grabar.emit(value);
          console.log('TERMINO DFE VALI');
      }
  } */

  onSubmitServicio() {
    /* console.log('ingresa a la aprobacion');
     console.log('nombre serv apr ' + this.f.NewName.value);
     console.log('nombre codigo apr ' + this.f.NewNameCod.value); */
     // NOMBRE DE SERVICIO
     if (this._service.newNameGTPStatus === 1   ) {
       console.log('se activo la limieza 1.1');
       this.f.NewName.clearValidators();
       this.f.NewName.reset();
      }
     if ( (this._service.newNameGTPStatus === 3   && this._service.name !== ''  && this._service.newName !== ''  )) {
       console.log('se activo la limieza 1.2');
       this.f.NewName.clearValidators();
       this.f.NewName.reset();
      }
     // CODIGO DEUDOR
       if (this._service.newNameCodeGTPStatus === 1) {
       console.log('se activo la limieza 2.1');
       this.f.NewNameCod.clearValidators();
       this.f.NewNameCod.reset();
       }
       if ( this._service.newNameCodeGTPStatus === 3 &&  this._service.debtorCode !== ''  && this._service.newNameCode !== '') {
         console.log('se activo la limieza 2.2');
         this.f.NewNameCod.clearValidators();
         this.f.NewNameCod.reset();
        }

     if (this.frm.valid) {
       console.log('el form es valido');
           let value: DataServiceGTP;
           value = this._service;
          // value.acceptednewName = (this.frm.value.NewName === 'S');
          // value.acceptednewNameCode = (this.frm.value.NewNameCod === 'S') ;
           // tslint:disable-next-line:max-line-length
         //  value.acceptednewName = (this._service.name  !== this._service.newName) ? ((this.frm.value.NewName === 'S') ? true : false) : true;
         // tslint:disable-next-line:max-line-length
         value.acceptednewName = ((this._service.newNameGTPStatus === 1   ) || ( (this._service.newNameGTPStatus === 3   && this._service.name !== ''  && this._service.newName !== ''  )) ) ? true : ((this.frm.value.NewName === 'S') ? true : false) ;
           // tslint:disable-next-line:max-line-length
          //  value.acceptednewNameCode = (this._service.debtorCode !== this._service.newNameCode ) ? ( (this.frm.value.NewNameCod === 'S') ? true : false) : true ;
          // tslint:disable-next-line:max-line-length
          value.acceptednewNameCode = ((this._service.newNameCodeGTPStatus === 1) || ( this._service.newNameCodeGTPStatus === 3 &&  this._service.debtorCode !== ''  && this._service.newNameCode !== '')) ? true :  ( (this.frm.value.NewNameCod === 'S') ? true : false);

          this.grabar.emit(value);
           console.log('TERMINO DFE VALI' + value.acceptednewName + ' ' + value.acceptednewNameCode);
       }
   }

  /*
      newName         name
    minimarket         ''       NUEVO     0  -
      ''            minimarket  APROBADO  1
      sm            minimarket  EDITADO   2  -
      sm            minimarket  RECHAZADO 3
      ''               sm       APROBADO  1
  */
  onSubmitServicio2() {
    /* console.log('ingresa a la aprobacion');
     console.log('nombre serv apr ' + this.f.NewName.value);
     console.log('nombre codigo apr ' + this.f.NewNameCod.value); */
     // NOMBRE DE SERVICIO
     if (this._service.newNameGTPStatus === 1  ) {
       console.log('se activo la limieza 1.1');
       this.f.NewName.clearValidators();
       this.f.NewName.reset();
      }
      if (this._service.newNameGTPStatus === 3) {
       console.log('se activo la limieza 1.2');
       this.f.NewName.clearValidators();
       this.f.NewName.reset();
      }
     // CODIGO DEUDOR
     if (this._service.newNameCodeGTPStatus === 1) {
       console.log('se activo la limieza 2.1');
       this.f.NewNameCod.clearValidators();
       this.f.NewNameCod.reset();
       }
      if (this._service.newNameCodeGTPStatus === 3 ) {
         console.log('se activo la limieza 2.2');
         this.f.NewNameCod.clearValidators();
         this.f.NewNameCod.reset();
      }

     if (this.frm.valid) {
       console.log('el form es valido');
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
       console.log('el form no es valido');
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
    } else {
      this.Dataparcial = true;
    }
   /* else if (this.tiposPago.length === 1) {
      this.tiposPago.push({
        code: 'P',
        name: "Siempre la deuda que vence primero"
      });
    }  */

  }

//////////------CHANGE--------

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



