import { Component, OnInit, Output, EventEmitter, Input, HostListener } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { AfiliacionService } from "src/app/shared/services/afiliacion.service";
import { MonedaModel, ServiceModel } from "src/app/shared/models";
import Swal from "sweetalert2";
import { ConfigurarServiciosComponent } from "../configurar-servicios/configurar-servicios.component";
import { drawPopup } from 'src/app/shared/services/popups';

@Component({
  selector: 'app-form-servicio',
  templateUrl: './form-servicio.component.html',
  styleUrls: ['./form-servicio.component.scss'],
  styles: [
    `
      :host >>> .tooltip-inner {
        background-color: #FFF;
        color: #0d131d !important;
        border-radius: 4px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.20);
        font-size: 11px !important;
        padding: .5em .3em;
        min-width:300px !important;
      }
      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #0d131d57;
        
      }
    `
  ]
})
export class FormServicioComponent implements OnInit {
  public createMode: boolean = false;
  public editMode: boolean = false;
  public gtpMode: boolean = false;
  public Dataparcial: boolean = true;
  public comAgente = 1;
  public comTienda = 7;
  submittedRequired = false;
  private tc: number = 3.37;

  constructor(private afiliacionService: AfiliacionService,
    private fb: FormBuilder, private stateEdit: ConfigurarServiciosComponent) {
    stateEdit.onFormAction.subscribe(e => this.formAction(e));
  }

  @Input() set service(value: ServiceModel) {
    if (value === null || value === undefined) {
      this._service = {
        res: '',
        nombre: 'Mensualidad',
        codDeudor: 'DNI',
        tipoDato: 'C',
        tipoPago: 'C',
        idCuenta: '',
        nroCuenta: '',
        moneda: '001',
        simboloMoneda: 'S/',
        usaWebApp: true,
        usaAgente: false,
        usaTienda: false,
        cobraMora: 'N',
        periodoMora: '1',
        tipoMora: 'M'
      }
      this.simboloMoneda = 'S/';
    }
    else {
      this._service = value;
      this.simboloMoneda = value.simboloMoneda
      this._service.simboloMoneda = this.simboloMoneda;
      if (this.simboloMoneda === 'S/') {
        this.comAgente = 1;
        this.comTienda = 7;
      }
      else {
        this.comAgente = Math.round((1 / this.tc) * 100) / 100;
        this.comTienda = Math.round((7 / this.tc) * 100) / 100;
      }
    }
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
  public _service: ServiceModel;
  @Output() grabar = new EventEmitter<any>();
  public services: ServiceModel[] = [];

  ngOnInit(): void {
    this.cuentas = [];
    this.afiliacionService.GetTipoCambio().subscribe(d => this.tc = d);
    this.editMode = (this._service.id !== null && this._service.id !== undefined && this._service.id > 0);
    this.gtpMode = (this._service.NewName !== null && this._service.NewNameCod !== null);
    var montod = ((this._service.monto !== null && this._service.monto !== undefined) ? this._service.monto : '1.00');
    var porcentajed = ((this._service.porcentaje !== null && this._service.porcentaje !== undefined) ? this._service.porcentaje : '1.00');

    let codDeudor = (this._service.newNameCodeGtpStatus === null || this._service.newNameCodeGtpStatus === 1 || this._service.newNameCodeGtpStatus === 2) ? 
      (this._service.codDeudor === 'RUC' || this._service.codDeudor === 'DNI' || this._service.codDeudor === 'Codigo Interno') ? this._service.codDeudor : 'Otro' : 
      (this._service.newNameCode === 'RUC' || this._service.newNameCode === 'DNI' || this._service.newNameCode === 'Codigo Interno') ? this._service.newNameCode : 'DNI';
    
      this.frm = this.fb.group({
      // tslint:disable-next-line:max-line-length
      nombre: new FormControl({
        value: (this._service.newNameGtpStatus === 0 || (this._service.newNameGtpStatus === 3 && this._service.nombre == null)) ?
          this._service.newName : this._service.nombre, disabled: this._service.nombreHabilitado
      }),
      res: new FormControl({ value: this._service.res, disabled: true }),
      codDeudor: new FormControl({
        value: codDeudor,
        disabled: this._service.nombreCodHabilitado
      }, [Validators.required]),
      nameCod: new FormControl({
        value: (this._service.codDeudor === null) ? this._service.newNameCode :
          ((this._service.codDeudor === 'Otro') ? this._service.nameCod : this._service.codDeudor),
        disabled: this._service.nombreCodHabilitado
      }),

      tipoDato: new FormControl({ value: this._service.tipoDato, disabled: this.editMode }, Validators.required),
      tipoPago: new FormControl({ value: this._service.tipoPago, disabled: this.editMode }, Validators.required),
      idCuenta: new FormControl({ value: this._service.idCuenta.toString(), disabled: false }, Validators.required),
      moneda: [this._service.moneda, Validators.required],
      usaAgente: new FormControl({ value: this._service.usaAgente, disabled: this.editMode }),
      usaTienda: new FormControl({ value: this._service.usaTienda, disabled: this.editMode }),
      usaWebApp: new FormControl({ value: this._service.usaWebApp, disabled: true }),
      cobraMora: [this._service.cobraMora, Validators.required],
      periodoMora: [this._service.periodoMora],
      tipoMora: [this._service.tipoMora],
      monto: new FormControl({ value: montod, disabled: true }),
      porcentaje: new FormControl({ value: porcentajed, disabled: true }),
      pagoPartes: [this._service.pagoPartes, Validators.required],
    });

    this.afiliacionService.GetCodDeudor().subscribe(d => this.codDeudor = d);
    this.afiliacionService.GetTipoDato().subscribe(d => this.tiposDato = d);
    this.afiliacionService.GetTipoPago().subscribe(d => {
      this.tiposPago = d;
    });
    this.afiliacionService.GetMoneda().subscribe(d => this.monedas = d);
    this.afiliacionService.GetPeriodoMora().subscribe(d => this.tiposMora = d);
    this.afiliacionService.GetCards().subscribe(d => {
      this.cuentas = d;
    });

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
  /* nombreAlert2(){
     if (this.editMode === true){
       if (this._service.newName.substring(0, 3) === '???'){
         return false;
       }
       if ( this._service.nombre  !== this._service.newName){
         return true;
       }
     }
   }  */
  nombreAlert() {
    if (this.editMode === true) {
      /*if (this._service.newNameGtpStatus === 1 || this._service.newNameGtpStatus === 3) {
        return false;
      }
      if  (this._service.newNameGtpStatus === 0 || this._service.newNameGtpStatus === 2) {
        return true;
      } */
      if (this._service.newName !== '') {
        return true;
      }

      // getCodDebtor  ConfigurarServiciosComponent
      /*
            if (this._service.newNameCodeGtpStatus === 0  || this._service.newNameCodeGtpStatus === 2) {
              return true;
            }
            if (this._service.newNameCodeGtpStatus === 1 ) {
              return false;
            }
            if (this._service.newNameCodeGtpStatus === 3 ) {
              if ( this._service.codDeudor == null  && this._service.newNameCode  !== null  ) {
                return true;
              } else {
                return false;
              }
            }
      */
      return false;
    }
  }

  /*  CodiAlert2() {
      // editMode === true && ( _service.codDeudor  !== _service.newNameCode)
      if (this.editMode === true){
        if (this._service.newNameCode.substring(0, 3) === '???'){
          return false;
        }
        if ( this._service.codDeudor  !== this._service.newNameCode){
          return true;
        }
      }
    } */
  CodiAlert() {
    // editMode === true && ( _service.codDeudor  !== _service.newNameCode)
    if (this.editMode === true) {
      /* if (this._service.newNameCodeGtpStatus  === 1 || this._service.newNameCodeGtpStatus === 3) {
         return false;
       }
       if  (this._service.newNameCodeGtpStatus === 0 || this._service.newNameCodeGtpStatus === 2) {
           return true;
       } */
      if (this._service.newNameCode !== '') {
        return true;
      }
      return false;
    }
  }

  onSubmitServicio() {
    this.submittedRequired = true;

    if (this.frm.valid) {
      const monto = parseFloat(this.frm.get('monto').value);
      const porcentaje = parseFloat(this.frm.get('porcentaje').value);
      const montofix = monto.toFixed(2);
      const porcentajefix = porcentaje.toFixed(2);
      this.frm.value.monto = montofix;
      this.frm.value.porcentaje = porcentajefix;

      if (this.frm.get('cobraMora').value === 'S') {
        if (this.frm.get('tipoMora').value === 'M') {

          if (monto !== null) {
            if (monto > 1000) {
              Swal.fire({
                text: 'el maximo monto que se puede ingresar es 1000',
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'CERRAR',
                allowOutsideClick: false,
                onOpen: drawPopup
              });
              return;
            }
            if (monto < 0.50) {
              Swal.fire({
                text: 'el minimo monto que se puede ingresar es 0.50',
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'CERRAR',
                allowOutsideClick: false,
                onOpen: drawPopup
              });
              return;
            } else {
              if (this.f.usaAgente.value === false && this.f.usaTienda.value === false && this.f.usaWebApp.value === false) {
                Swal.fire({
                  text: 'Debe escoger un medio de pago',
                  showCloseButton: true,
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonText: 'CERRAR',
                  allowOutsideClick: false,
                  onOpen: drawPopup
                });
              } else {

                let value: ServiceModel;
                // value.usaWebApp = true;
                if (this.editMode) {
                  value = this._service;
                  value.idCuenta = this.frm.value.idCuenta;
                  // value.nombre = this.frm.value.nombre;
                  //   value.newName = this.frm.value.nombre;
                  // value.nameCod = this.frm.value.nameCod;
                  //  value.codDeudor = this.frm.value.codDeudor;
                  // tslint:disable-next-line:max-line-length
                  value.newName = (value.nombreHabilitado) ? value.newName : ((this.frm.value.nombre === value.nombre) ? value.newName : this.frm.value.nombre);
                  value.newNameCode = (value.nombreCodHabilitado) ? value.newNameCode : (this.frm.value.codDeudor === 'Otro') ?
                    ((this.frm.value.nameCod === value.codDeudor) ? value.newNameCode : this.frm.value.nameCod) :
                    (this.frm.value.codDeudor === value.codDeudor) ? value.newNameCode : this.frm.value.codDeudor;
                  // value.nroCuenta = this.frm.value.nroCuenta;
                  value.moneda = this.frm.value.moneda;
                  value.cobraMora = this.frm.value.cobraMora;
                  value.periodoMora = this.frm.value.periodoMora;
                  value.tipoMora = this.frm.value.tipoMora;
                  value.monto = this.frm.value.monto;
                  value.porcentaje = this.frm.value.porcentaje;
                  value.pagoPartes = this.frm.value.pagoPartes;
                  value.usaWebApp = true;
                } else {
                  value = this.frm.value;
                  value.id = null;
                  value.usaWebApp = true;
                  value.newName = this.frm.value.nombre;
                  value.newNameCode = (this.frm.value.codDeudor === 'Otro') ? this.frm.value.nameCod : this.frm.value.codDeudor;
                }
                let cta = this.cuentas.find(c => c.id === value.idCuenta);
                value.nroCuenta = `${cta.number.substr(0, 13)} (${(cta.currency === '001' ? 'Soles' : 'Dólares')})`;
                value.simboloMoneda = this.simboloMoneda;
                value.usaWebApp = true;
                this.grabar.emit(value);
              }

            }

          } else {
            Swal.fire({
              text: 'Ingrese el monto',
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: 'CERRAR',
              allowOutsideClick: false,
              onOpen: drawPopup
            });
            return;
          }

        } else {
          if (porcentaje === null) {
            Swal.fire({
              text: 'Ingrese el porcentaje',
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: 'CERRAR',
              allowOutsideClick: false,
              onOpen: drawPopup

            });
            return;
          }
          if (porcentaje > 100) {
            Swal.fire({
              text: 'el maximo porcentaje que se puede ingresar es 100',
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: 'CERRAR',
              allowOutsideClick: false,
              onOpen: drawPopup

            });
            return;
          }
          if (porcentaje < 0.01) {
            Swal.fire({
              text: 'el minimo porcentaje 0.01%',
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: 'CERRAR',
              allowOutsideClick: false,
              onOpen: drawPopup

            });
            return;
          } else {
            if (this.f.usaAgente.value === false && this.f.usaTienda.value === false && this.f.usaWebApp.value === false) {
              Swal.fire({
                html: 'Debe escoger un medio de pago',
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'CERRAR',
                allowOutsideClick: false,
                onOpen: drawPopup
              });
            } else {
              let value: ServiceModel;
              console.log('ingresa 2');
              // value.usaWebApp = true;
              if (this.editMode) {
                value = this._service;
                value.idCuenta = this.frm.value.idCuenta;
                // value.nroCuenta = this.frm.value.nroCuenta;
                // value.nombre = this.frm.value.nombre;
                // tslint:disable-next-line:max-line-length
                value.newName = (value.nombreHabilitado) ? value.newName : ((this.frm.value.nombre === value.nombre) ? value.newName : this.frm.value.nombre);
                value.newNameCode = (value.nombreCodHabilitado) ? value.newNameCode : (this.frm.value.codDeudor === 'Otro') ?
                  ((this.frm.value.nameCod === value.codDeudor) ? value.newNameCode : this.frm.value.nameCod) :
                  (this.frm.value.codDeudor === value.codDeudor) ? value.newNameCode : this.frm.value.codDeudor;
                value.moneda = this.frm.value.moneda;
                value.cobraMora = this.frm.value.cobraMora;
                value.periodoMora = this.frm.value.periodoMora;
                value.tipoMora = this.frm.value.tipoMora;
                value.monto = this.frm.value.monto;
                value.porcentaje = this.frm.value.porcentaje;
                value.pagoPartes = this.frm.value.pagoPartes;
              } else {
                console.log('crea un nuevo 2');
                value = this.frm.value;
                value.id = null;
                value.newName = this.frm.value.nombre;
                value.newNameCode = (this.frm.value.codDeudor === 'Otro') ? this.frm.value.nameCod : this.frm.value.codDeudor;
                console.log('crea un nuevo 3 en edicion' + value.newName);
              }
              let cta = this.cuentas.find(c => c.id === value.idCuenta);
              value.nroCuenta = `${cta.number.substr(0, 13)} (${(cta.currency === '001' ? 'Soles' : 'Dólares')})`;
              value.simboloMoneda = this.simboloMoneda;
              value.usaWebApp = true;
              this.grabar.emit(value);
            }
          }

        }
      } else {
        if (this.f.usaAgente.value === false && this.f.usaTienda.value === false && this.f.usaWebApp.value === false) {
          Swal.fire({
            html: 'Debe escoger un medio de pago',
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#d33',
            cancelButtonText: 'CERRAR',
            allowOutsideClick: false,
            onOpen: drawPopup
          });
        } else {
          let value: ServiceModel;
          if (this.editMode) {
            value = this._service;
            value.idCuenta = this.frm.value.idCuenta;
            // value.nroCuenta = this.frm.value.nroCuenta;
            // tslint:disable-next-line:max-line-length
            value.newName = (value.nombreHabilitado) ? value.newName : ((this.frm.value.nombre === value.nombre) ? value.newName : this.frm.value.nombre);
            value.newNameCode = (value.nombreCodHabilitado) ? value.newNameCode : (this.frm.value.codDeudor === 'Otro') ?
              ((this.frm.value.nameCod === value.codDeudor) ? value.newNameCode : this.frm.value.nameCod) :
              (this.frm.value.codDeudor === value.codDeudor) ? value.newNameCode : this.frm.value.codDeudor;
            value.moneda = this.frm.value.moneda;
            value.cobraMora = this.frm.value.cobraMora;
            value.periodoMora = this.frm.value.periodoMora;
            value.tipoMora = this.frm.value.tipoMora;
            value.monto = this.frm.value.monto;
            value.porcentaje = this.frm.value.porcentaje;
            value.pagoPartes = this.frm.value.pagoPartes;
            value.usaWebApp = true;
          } else {
            value = this.frm.value;
            value.id = null;
            value.newName = this.frm.value.nombre;
            value.newNameCode = (this.frm.value.codDeudor === 'Otro') ? this.frm.value.nameCod : this.frm.value.codDeudor;
          }
          let cta = this.cuentas.find(c => c.id === value.idCuenta);
          value.nroCuenta = `${cta.number.substr(0, 13)} (${(cta.currency === '001' ? 'Soles' : 'Dólares')})`;
          value.simboloMoneda = this.simboloMoneda;
          value.usaWebApp = true;

          this.grabar.emit(value);
        }
      }
    }
  }

  changeMoneda(event) {
    this.simboloMoneda = (this.f.moneda.value === "001" ? "S/" : "$");
    if (this.simboloMoneda === 'S/') {
      this.comAgente = 1;
      this.comTienda = 7;
    }
    else {
      this.comAgente = Math.round((1 / this.tc) * 100) / 100;
      this.comTienda = Math.round((7 / this.tc) * 100) / 100;
    }
  }

  changeCuenta(val) {
    let cta = this.cuentas.find(c => c.id == val);
    this.simboloMoneda = (cta.currency === '001' ? 'S/' : '$');
    this.f.moneda.setValue(cta.currency);
    if (this.simboloMoneda === 'S/') {
      this.comAgente = 1;
      this.comTienda = 7;
    }
    else {
      this.comAgente = Math.round((1 / this.tc) * 100) / 100;
      this.comTienda = Math.round((7 / this.tc) * 100) / 100;
    }
  }

  TipoCobro() {
    this.frm.get('tipoMora').setValue('M');
    this.cobraMonto = true;
    this.cobraPorcentaje = false;
    if (this.frm.get('periodoMora').value === '1' || this.frm.get('periodoMora').value === '2') {
      this.cmoraporce = true;

      this.f.monto.clearValidators();
      this.f.monto.enable();
      this.f.monto.setValidators([Validators.required, Validators.pattern('^([0-9]{1,4})?(\.[0-9]{1,2})?$'), Minimo(0.50), Maximo(1000)]);
      this.f.monto.reset("1.00");

      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      this.f.porcentaje.setValidators([Validators.required, Validators.pattern('^([0-9]{1,4})?(\.[0-9]{1,2})?$'), Minimo(0.01), Maximo(100)]);
      this.f.porcentaje.reset("1.00");
    } else {
      this.cmoraporce = false;
    }
  }

  Codigo(event) {
    if (event === 'Otro') {
      this.f.nameCod.setValidators([Validators.required, Validators.minLength(3)]);
    } else {
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
      this.f.monto.setValidators([Validators.required, Validators.pattern('^([0-9]{1,4})?(\.[0-9]{1,2})?$'), Minimo(0.50), Maximo(1000)])
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
      this.f.monto.setValidators([Validators.required, Validators.pattern('^([0-9]{1,4})?(\.[0-9]{1,2})?$'), Minimo(0.50), Maximo(1000)]);
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.disable();
      if (changeData) {
        this.f.porcentaje.reset("1.00");
      }
    } else if (this.cobraMora && this.cobraPorcentaje) {
      this.f.porcentaje.enable();
      this.f.porcentaje.setValidators([Validators.required, Validators.pattern('^([0-9]{1,4})?(\.[0-9]{1,2})?$'), Minimo(0.01), Maximo(100)]);
      this.f.monto.clearValidators();
      this.f.monto.disable();
      if (changeData) {
        this.f.monto.reset("1.00");
      }
    }
  }

  selectCodigo(event) {
    if (event === 'Otro') {
      //  this.f.codDeudor.reset();
      this.f.nameCod.setValidators([Validators.required, Validators.minLength(3)]);
      this.f.nameCod.reset();
    }
    else {
      this.f.nameCod.clearValidators();
      this.f.nameCod.reset();
    }
  }

  formAction(action: string) {
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
    let initalValue = parseFloat(this.f.monto.value);
    if (!isNaN(initalValue))
      this.f.monto.setValue(initalValue.toFixed(2));

  }
  MoraPorcenBlur(e) {
    let initalValue = parseFloat(this.f.porcentaje.value);
    if (!isNaN(initalValue))
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
  let numero = /[0-9]/g
  let raro = /[-{1,}]-?/g;
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
