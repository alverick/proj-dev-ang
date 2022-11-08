import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { forEachObjIndexed } from 'ramda';
import { isNotNil } from 'ramda-adjunct';
import { IEntryModel } from 'src/app/shared/models';
import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { GtpService } from 'src/app/shared/services/gtp.service';

@Component({
  selector: 'cs-empresa-gtp',
  templateUrl: './empresa-gtp.component.html',
  styleUrls: ['./empresa-gtp.component.scss'],
})
export class EmpresaGTPComponent implements OnInit {
  public _enterprise: DataEnterpriseGTP;
  formGroup: FormGroup;
  submitted = false;
  rubros: IEntryModel[] = [];
  errorMessages = {
    email: {
      required: 'El correo electrónico  es obligatorio',
      pattern: 'Ingrese un correo electrónico  válido',
      minlength: 'El correo electrónico debe tener mínimo 10 dígitos',
    },
    telefono: {
      required: 'Teléfono o celular es obligatorio',
      pattern: 'Teléfono o celular es obligatorio',
      minlength: 'El teléfono o celular debe tener mínimo 9 dígitos',
    },
  };
  @Input() set enterprise(value: DataEnterpriseGTP) {
    this._enterprise = value;
  }
  @Output() grabar = new EventEmitter<any>();

  constructor(
    public afiliacionService: AfiliacionService,
    private formBuilder: FormBuilder,
    public gtpService: GtpService
  ) {}

  ngOnInit() {
    this.afiliacionService.GetRubrosAll().subscribe((d) => {
      this.rubros = d;
    });

    const {
      NombreApproved,
      ruc,
      entry,
      movilOperator,
      email,
      newName,
      movilNumber,
      newNameGTPStatus,
    } = this._enterprise;

    const isNotEditable = newNameGTPStatus !== 1;

    let newNombreApprovedValue: string;
    switch (NombreApproved) {
      case undefined:
        newNombreApprovedValue = '';
        break;
      case true:
        newNombreApprovedValue = 'S';
        break;
      default:
        newNombreApprovedValue = 'N';
        break;
    }

    this.formGroup = this.formBuilder.group({
      ruc: new FormControl({ value: ruc, disabled: true }),
      newName: new FormControl({
        value: newName,
        disabled: true,
      }),
      NewNameApproved: [
        { value: newNombreApprovedValue, disabled: !isNotEditable },
        Validators.required,
      ],
      entry: new FormControl({
        value: entry,
        disabled: true,
      }),
      email: new FormControl(
        {
          value: email,
          disabled: isNotEditable,
        },
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
          Validators.minLength(10),
          Validators.maxLength(100),
        ]
      ),
      movilNumber: new FormControl(
        {
          value: movilNumber,
          disabled: isNotEditable,
        },
        [
          Validators.required,
          Validators.pattern(/^9\d{8}$/),
          Validators.minLength(9),
          Validators.maxLength(9),
        ]
      ),
      movilOperator: new FormControl({
        value: movilOperator,
        disabled: true,
      }),
    });
  }

  get f(): any {
    return this.formGroup.controls;
  }

  getErrorMessage(
    controlName: FormControl | AbstractControl,
    errors: {
      [key: string]: string;
    }
  ): string {
    let result = '';
    forEachObjIndexed((value, key) => {
      if (isNotNil(errors[key])) {
        result = errors[key];
        return;
      }
    }, controlName.errors);
    return result;
  }

  onSubmitEmpresa() {
    this.submitted = true;
    const { valid, value } = this.formGroup;
    if (valid) {
      const isNotEditable = this._enterprise.newNameGTPStatus !== 1;
      let dataEnterprise: DataEnterpriseGTP;
      if (isNotEditable) {
        dataEnterprise = {
          ...this._enterprise,
          NombreApproved: value.NewNameApproved === 'S',
        };
      } else {
        dataEnterprise = { ...this._enterprise, ...value };
      }
      this.grabar.emit(dataEnterprise);
    }
  }
}
