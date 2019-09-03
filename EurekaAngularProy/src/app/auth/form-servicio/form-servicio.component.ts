import { Component, OnInit, Output, EventEmitter, Input, HostListener } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { AfiliacionService } from "src/app/shared/services/afiliacion.service";
import { MonedaModel, ServiceModel } from "src/app/shared/models";
import Swal from "sweetalert2";
import { ConfigurarServiciosComponent } from "../configurar-servicios/configurar-servicios.component";

@Component({
  selector: 'app-form-servicio',
  templateUrl: './form-servicio.component.html',
  styleUrls: ['./form-servicio.component.scss']
})
export class FormServicioComponent implements OnInit {
  public editMode: boolean = false;

  constructor(private afiliacionService: AfiliacionService,
    private fb: FormBuilder,private stateEdit: ConfigurarServiciosComponent ) {
      stateEdit.onFormAction.subscribe(e => this.formAction(e));
    }

  @Input() set service(value: ServiceModel) {
    console.log('set service');
    if (value === null || value === undefined) {
      this._service = {
        nombre: 'Mensualidad',
        codDeudor: 'DNI',
        tipoDato: 'C',
        tipoPago: 'C',
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
      console.log(value);
      this._service = value;
      this.simboloMoneda = value.simboloMoneda
      delete this._service.simboloMoneda;
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

  simboloMoneda: string = 'S/';
  cobraMora: boolean = false;
  cobraMonto: boolean = true;
  cobraPorcentaje: boolean = false;

  private _service: ServiceModel;
  @Output() grabar = new EventEmitter<any>();
  public services: ServiceModel[] = [];

  ngOnInit(): void {
    this.editMode = (this._service.id !== null && this._service.id !== undefined && this._service.id > 0);
    console.log(this._service);
    this.frm = this.fb.group({
      nombre: new FormControl({ value: this._service.nombre, disabled: this.editMode }, [Validators.required, Validators.minLength(3)]),
      codDeudor: new FormControl({ value: this._service.codDeudor, disabled: this.editMode }, [Validators.required]),
      nameCod: new FormControl({ value: this._service.nameCod, disabled: this.editMode}),
      tipoDato: new FormControl({ value: this._service.tipoDato, disabled: this.editMode }, Validators.required),
      tipoPago: new FormControl({ value: this._service.tipoPago, disabled: this.editMode }, Validators.required),
      nroCuenta: [this._service.nroCuenta, [Validators.required, Validators.minLength(13)]],
      moneda: [this._service.moneda, Validators.required],
      usaAgente: new FormControl({ value: this._service.usaAgente, disabled: this.editMode }),
      usaTienda: new FormControl({ value: this._service.usaTienda, disabled: this.editMode }),
      usaWebApp: new FormControl({ value: this._service.usaWebApp, disabled: this.editMode }),
      cobraMora: [this._service.cobraMora, Validators.required],
      periodoMora: [this._service.periodoMora],
      tipoMora: [this._service.tipoMora],
      monto: [(!this._service.monto ? '1.00' : this._service.monto) , [Validators.pattern('^[0-9]{1,4}(\.[0-9]{2})?$'), Minimo(1), Maximo(1000)]],
      porcentaje: [(!this._service.porcentaje ? '1' : this._service.porcentaje), [Validators.pattern('^[0-9]{1,4}(\.[0-9]{2})?$'), Minimo(0.01), Maximo(100)]]
    });
    this.afiliacionService.GetCodDeudor().subscribe(d => this.codDeudor = d);
    this.afiliacionService.GetTipoDato().subscribe(d => this.tiposDato = d);
    this.afiliacionService.GetTipoPago().subscribe(d => this.tiposPago = d);
    this.afiliacionService.GetMoneda().subscribe(d => this.monedas = d);
    this.afiliacionService.GetPeriodoMora().subscribe(d => this.tiposMora = d);
    this.changeMora();
    this.changeTipoMora();
  }

  onChangeTipoDato() {
    if (this.frm.get('tipoDato').value === 'P') {
      this.frm.get('tipoPago').setValue('C');
      this.tiposPago.pop();
    }
    else if (this.tiposPago.length === 1) {
      this.tiposPago.push({
        code: 'P',
        name: "Siempre la deuda que vence primero"
      });
    }
  }

  onSubmitServicio() {

    if (this.frm.valid)
    {
     this.stateEdit.stateCreate =false;
     this.stateEdit.stateEdit = false;

     console.log('stado de editar ' + this.stateEdit.stateEdit);

     const monto  = parseFloat(this.frm.get('monto').value);
     const porcentaje  = parseFloat(this.frm.get('porcentaje').value);

     if (this.frm.get('cobraMora').value === 'S') {
        if (this.frm.get('tipoMora').value === 'M') {

          if (monto !== null ) {
            if (monto > 1000 ) {
              Swal.fire({
                type: 'error',
                text: 'el maximo monto que se puede ingresa es 1000',
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                cancelButtonText:  'Cerrar',
                allowOutsideClick: false,

              });
              return;
            }
            if(monto < 1 ) {
              Swal.fire({
                type: 'error',
                text: 'el minimo monto que se puede ingresa es 1',
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                cancelButtonText:  'Cerrar',
                allowOutsideClick: false,

              });
              return;
            } else {
              if (this.f.usaAgente.value === false && this.f.usaTienda.value === false && this.f.usaWebApp.value === false) {
                Swal.fire({
                  type: 'error',
                  html: 'Debe escoger un medio de pago',
                  showCloseButton: true,
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText:  'Cerrar',
                  allowOutsideClick: false,});
              } else {

                let value: ServiceModel;
                if (this.editMode) {
                  console.log(this._service);
                  value = this._service;
                  value.nroCuenta = this.frm.value.nroCuenta;
                  value.cobraMora = this.frm.value.cobraMora;
                  value.periodoMora = this.frm.value.periodoMora;
                  value.tipoMora = this.frm.value.tipoMora;
                  value.monto = this.frm.value.monto;
                  value.porcentaje = this.frm.value.porcentaje;
                }
                else {
                  value = this.frm.value;
                }
                    value.simboloMoneda = this.simboloMoneda;
                this.grabar.emit(value);
              }

            }

          }else {
            Swal.fire({
              type: 'error',
              text: 'Ingrese el monto',
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText:  'Cerrar',
              allowOutsideClick: false,

            });
            return;
          }

        } else {
          if (porcentaje === null) {
            Swal.fire({
              type: 'error',
              text: 'Ingrese el porcentaje',
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText:  'Cerrar',
              allowOutsideClick: false,

            });
            return;
          }
          if (porcentaje > 100 ) {
            Swal.fire({
              type: 'error',
              text: 'el maximo porcentaje que se puede ingresa es 100',
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText:  'Cerrar',
              allowOutsideClick: false,

            });
            return;
          }
          if (porcentaje < 0.01 ) {
            Swal.fire({
              type: 'error',
              text: 'el minimo porcentaje 0.01%',
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText:  'Cerrar',
              allowOutsideClick: false,

            });
            return;
          } else {
            if (this.f.usaAgente.value === false && this.f.usaTienda.value === false && this.f.usaWebApp.value === false) {
              Swal.fire({
                type: 'error',
                html: 'Debe escoger un medio de pago',
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                cancelButtonText:  'Cerrar',
                allowOutsideClick: false, });
            } else {
              let value: ServiceModel;
              if (this.editMode) {
                console.log(this._service);
                value = this._service;
                value.nroCuenta = this.frm.value.nroCuenta;
                value.cobraMora = this.frm.value.cobraMora;
                value.periodoMora = this.frm.value.periodoMora;
                value.tipoMora = this.frm.value.tipoMora;
                value.monto = this.frm.value.monto;
                value.porcentaje = this.frm.value.porcentaje;
              }
              else {
                value = this.frm.value;
              }
                value.simboloMoneda = this.simboloMoneda;
              this.grabar.emit(value);
            }
          }

        }
      } else {
          if (this.f.usaAgente.value === false && this.f.usaTienda.value === false && this.f.usaWebApp.value === false) {
            Swal.fire({ type: 'error',
                        html: 'Debe escoger un medio de pago',
                        showCloseButton: true,
                        showCancelButton: true,
                        showConfirmButton: false,
                        cancelButtonColor: '#d33',
                        cancelButtonText:  'Cerrar',
                        allowOutsideClick: false, });
          } else {
            let value: ServiceModel;
            if (this.editMode) {
              console.log(this._service);
              value = this._service;
              value.nroCuenta = this.frm.value.nroCuenta;
              value.cobraMora = this.frm.value.cobraMora;
              value.periodoMora = this.frm.value.periodoMora;
              value.tipoMora = this.frm.value.tipoMora;
              value.monto = this.frm.value.monto;
              value.porcentaje = this.frm.value.porcentaje;
            }
            else {
              value = this.frm.value;
            }
            value.simboloMoneda = this.simboloMoneda;
            console.log(value);
            this.grabar.emit(value);
          }
      }
    }
  }

  changeMoneda() {
    this.simboloMoneda = (this.f.moneda.value === "001" ? "S/" : "$");
  }

  changeMora() {
    this.cobraMora = (this.f.cobraMora.value === 'S');
    if (this.cobraMora) {
      this.f.periodoMora.setValidators([Validators.required]);
    } else {
      this.f.periodoMora.clearValidators();
      this.f.periodoMora.reset();
    }
  }

  changeTipoMora() {
    this.cobraMonto = (this.f.tipoMora.value === "M");
    this.cobraPorcentaje = (this.f.tipoMora.value === "P");
    if (this.cobraMora && this.cobraMonto) {
      this.f.monto.setValidators([Validators.required,Validators.pattern('^[0-9]{1,4}(\.[0-9]{2})?$'), Minimo(1), Maximo(1000)]);
      this.f.porcentaje.clearValidators();
      this.f.porcentaje.value = "1";
    } else if (this.cobraMora && this.cobraPorcentaje) {
      this.f.porcentaje.setValidators([Validators.required, Validators.pattern('^[0-9]{1,3}(\.[0-9]{2})?$'), Minimo(0.01), Maximo(100)]);
      this.f.monto.clearValidators();
      this.f.monto.value = "1.00";
    }
  }

  selectCodigo(event){
    if(event === 'Otro'){
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
  
  nameCodBlur(e) {
    let initalValue = this.f.nameCod.value;
    this.f.nameCod.setValue(initalValue.trim());
  }
  nameSerInput(e) {
    let initalValue = this.f.nombre.value;
   /* initalValue = initalValue.replace(/[ ]{2}/g, ' '); 
    initalValue = initalValue.replace(/[ ]{2}$/g, '');  */
    initalValue = initalValue.replace(/\s{2,}/g, " ");
    this.f.nombre.setValue(initalValue.replace(/[^ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ-]*/g, ''));
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
