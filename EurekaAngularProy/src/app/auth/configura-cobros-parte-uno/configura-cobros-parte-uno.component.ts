import { Component, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { ServiceModel } from "src/app/shared/models";

declare var $: any;

@Component({
  selector: "app-configura-cobros-parte-uno",
  templateUrl: "./configura-cobros-parte-uno.component.html",
  styleUrls: ["./configura-cobros-parte-uno.component.scss"],
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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initService();
    this.editMode =
    this._service.id !== null &&
    this._service.id !== undefined &&
    this._service.id > 0;

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

  initService(){
    this._service = {
      res: "",
      nombre: "",
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
  }

  onSubmitServicio() {
    this.submittedRequired = true;
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

  onImgDoubt(){
    $('#concept-charge').modal('show');
  }
}

function Alfanumerico(c: FormControl) {
  let regex = /[0-9a-zA-Z]-?/g;
  if (c.value && !regex.test(c.value)) {
    return { alfa: true };
  }
  return null;
}
