import {
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import {
  type AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  type UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { forEachObjIndexed } from 'ramda';
import { isNotNil } from 'ramda-adjunct';
import { mobileOperators } from '../../../../shared/constants/company';

import { emailRegex } from '../../../../shared/constants/patterns';
import { type IEntryModel } from '../../../../shared/models';
import { ICompanyData } from '../../../../shared/models/company-data';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';

@Component({
  selector: 'cs-empresa-gtp',
  templateUrl: './empresa-gtp.component.html',
})
export class EmpresaGTPComponent implements OnInit {
  public _enterprise: ICompanyData;
  formGroup: UntypedFormGroup;
  submitted = false;
  rubros: IEntryModel[] = [];
  errorMessages = {
    email: {
      required: 'El correo electrónico  es obligatorio',
      pattern: 'Ingrese un correo electrónico  válido',
      minlength: 'El correo electrónico debe tener mínimo 10 dígitos',
    },
    movilNumber: {
      required: 'Teléfono o celular es obligatorio',
      pattern: 'Teléfono o celular es obligatorio',
      minlength: 'El teléfono o celular debe tener mínimo 9 dígitos',
    },
  };
  @Input() set enterprise(value: ICompanyData) {
    this._enterprise = value;
  }
  @Output() grabar = new EventEmitter<any>();

  constructor(
    public afiliacionService: AfiliacionService,
    private formBuilder: UntypedFormBuilder
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

    const operator = mobileOperators.find(
      (operator) => operator.value === movilOperator,
    );

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
      ruc: new UntypedFormControl({ value: ruc, disabled: true }),
      newName: new UntypedFormControl({
        value: newName,
        disabled: true,
      }),
      NewNameApproved: [
        { value: newNombreApprovedValue, disabled: !isNotEditable },
        Validators.required,
      ],
      entry: new UntypedFormControl({
        value: entry,
        disabled: true,
      }),
      email: new UntypedFormControl(
        {
          value: email,
          disabled: true,
        },
        [
          Validators.required,
          Validators.pattern(emailRegex),
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ),
      movilNumber: new UntypedFormControl(
        {
          value: movilNumber,
          disabled: true,
        },
        [
          Validators.required,
          Validators.pattern(/^9\d{8}$/),
          Validators.minLength(9),
          Validators.maxLength(9),
        ],
      ),
      movilOperator: new UntypedFormControl({
        value: operator.label,
        disabled: true,
      }),
    });
  }

  get f(): any {
    return this.formGroup.controls;
  }

  getErrorMessage(
    controlName: UntypedFormControl | AbstractControl,
    errors: {
      [key: string]: string;
    },
  ) {
    let result = '';
    forEachObjIndexed((_value, key) => {
      if (isNotNil(errors[key])) {
        result = errors[key];
      }
    }, controlName.errors);
    return result;
  }

  onSubmitEmpresa() {
    this.submitted = true;
    const { valid, value } = this.formGroup;
    if (valid) {
      const isNotEditable = this._enterprise.newNameGTPStatus !== 1;
      let dataEnterprise: ICompanyData;
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
