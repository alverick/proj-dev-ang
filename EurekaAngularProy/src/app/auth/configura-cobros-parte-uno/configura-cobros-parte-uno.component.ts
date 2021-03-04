import { ActivatedRoute, Router } from "@angular/router";
import { Component, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { AfiliacionService } from "src/app/shared/services/afiliacion.service";
import { ServiceModel } from "src/app/shared/models";
import Swal from "sweetalert2";
import { drawPopup } from "src/app/shared/services/popups";

declare var $: any;

@Component({
  selector: "app-configura-cobros-parte-uno",
  templateUrl: "./configura-cobros-parte-uno.component.html",
  styleUrls: ["./configura-cobros-parte-uno.component.scss"],
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
export class ConfiguraCobrosParteUnoComponent implements OnInit {
  frm: FormGroup;
  public _service: ServiceModel;
  submittedRequired = false;
  public editMode: boolean = false;

  get f(): any {
    return this.frm.controls;
  }

  @Input() set service(value: ServiceModel) {
    if (value === null || value === undefined) {
      this._service = {
        res: "",
        nombre: "Mensualidad",
        codDeudor: "DNI",
        tipoDato: "C",
        tipoPago: "C",
        idCuenta: "",
        nroCuenta: "",
        moneda: "001",
        simboloMoneda: "S/",
        usaWebApp: true,
        usaAgente: false,
        usaTienda: false,
        cobraMora: "N",
        periodoMora: "1",
        tipoMora: "M",
      };
    } else {
      this._service = value;
    }
  }

  constructor(
    private fb: FormBuilder,
    private afiliacionService: AfiliacionService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.data.subscribe(d => {
      console.log(d.isEdit);
      this.editMode = d.isEdit;

      if(this.isNew() == true){
        this.initializeService();
        //console.log('Lista de Servicios:', this.services)
      }else{
        this.getService();
        //console.log('Lista de Servicios:', this.services)
      }

      this.initializeForm();
    });
    /*this.editMode =
      this._service.id !== null &&
      this._service.id !== undefined &&
      this._service.id > 0;*/

  }

  initializeForm(){
    this.frm = this.fb.group({
      nombre: new FormControl(
        {
          value:
            this._service.newNameGtpStatus === 0 ||
            (this._service.newNameGtpStatus === 3 &&
              this._service.nombre == null)
              ? this._service.newName
              : this._service.nombre,
          disabled: this._service.nombreHabilitado,
        },
        [
          Validators.required,
          Validators.minLength(3),
          Alfanumerico,
          Validators.pattern(
            "^[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ]*[-0-9ñÑA-Za-zÁÉÍÓÚáéíóú& ][-0-9ñÑA-Za-zÁÉÍÓÚáéíóú&  ]*$"
          ),
        ]
      ),
    });
  }

  initializeService() {
    //tipoDato: "C",
    //tipoPago: "C",
    //codDeudor: "DNI",
    //cobraMora: 'N'
    this._service = {
      res: "",
      nombre: "",
      codDeudor: "",
      tipoDato: "",
      tipoPago: "",
      idCuenta: "",
      nroCuenta: "",
      moneda: "001",
      simboloMoneda: "S/",
      usaWebApp: true,
      usaAgente: false,
      usaTienda: false,
      cobraMora: "",
      periodoMora: "1",
      tipoMora: "M",
      nombreCodHabilitado: false,
      newNameCode: ''
    };
  }

  getService(){
    this._service = Object.assign(
      {},
      this.afiliacionService.currentServiceModel
    );
  }

  isNew(): boolean{
    if(this.afiliacionService.currentServiceModel === null
      || this.afiliacionService.currentServiceModel === undefined ){
      return true;
    }else{
      return false
    }
  }

  onSubmitServicio() {
    this.submittedRequired = true;

    if (this.frm.valid) {
      let value: ServiceModel;
      if (this.editMode) {
        value = this._service;
        value.newName = value.nombreHabilitado
        ? value.newName
        : this.frm.value.nombre === value.nombre
        ? value.newName
        : this.frm.value.nombre;

        if(this.isAddedName(this.f.nombre.value)== false){
          this.setCurrentServiceModel(this.f.nombre.value);
          this.goNext();
        }
      } else {
        //value = this.frm.value;
        this._service.id = null;
        this._service.newName = this.frm.value.nombre;
        if(this.isAddedName(this.f.nombre.value)== false){
          this.setCurrentServiceModel(this.f.nombre.value);
          this.goNext();
        }


        /*
        if (this.afiliacionService.currentIndex >= 0) {
        } else {
          let nro = 1;

          this.afiliacionService.services.forEach((s, i) => {
            if (s.nombre.startsWith(this.frm.value.nombre)) {
              if (
                !isNaN(
                  parseInt(s.nombre.substr(this.frm.value.nombre.length))
                ) ||
                s.nombre.substr(this.frm.value.nombre.length) === ""
              ) {
                nro += 1;
              }
            }
          });

          if (nro > 1) {
            value.nombre += nro.toString();
          }

          this.setCurrentServiceModel(this.f.nombre.value);
          this.goNext();
        }*/
      }
    }
  }

  setCurrentServiceModel(nombre: string) {
    this.afiliacionService.currentServiceModel = this._service;
    this.afiliacionService.currentServiceModel.nombre = nombre;
    console.log(this.afiliacionService.currentServiceModel);
  }

  isAddedName(nombre: string): boolean {
    let addedName = false;
    this.afiliacionService.services.forEach((service, index) => {
      if (
        service.nombre.toUpperCase() === nombre.toUpperCase() &&
        index !== this.afiliacionService.currentIndex
      ) {
        Swal.fire({
          text: "Este servicio ya existe",
          allowOutsideClick: false,
          onOpen: drawPopup,
        });
        addedName = true;
      }
    });

    return addedName;
  }

  nameSerInput(e) {
    let initalValue = this.f.nombre.value;
    /* initalValue = initalValue.replace(/[ ]{2}/g, ' ');
     initalValue = initalValue.replace(/[ ]{2}$/g, '');  */
    initalValue = initalValue.replace(/\s{2,}/g, " ");
    this.f.nombre.setValue(
      initalValue.replace(/[^ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]*/g, "")
    );
  }

  nameSerBlur(e) {
    let initalValue = this.f.nombre.value;
    this.f.nombre.setValue(initalValue.trim());
  }

  nombreAlert() {
    if (this.editMode === true) {
      if (this._service.newName !== "") {
        return true;
      }
      return false;
    }
  }

  onImgDoubt() {
    $("#concept-charge").modal("show");
  }

  goNext(){
    this.router.navigate(["/configuraCobrosParteDos"]);
  }

}

function Alfanumerico(c: FormControl) {
  let regex = /[0-9a-zA-Z]-?/g;
  if (c.value && !regex.test(c.value)) {
    return { alfa: true };
  }
  return null;
}
