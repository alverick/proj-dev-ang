import { Component, inject, input, type OnInit, output } from '@angular/core';
import {
  type AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  type UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Ripple } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { forEachObjIndexed } from 'ramda';
import { isNotNil } from 'ramda-adjunct';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { mobileOperators } from '../../../../shared/constants/company';
import { emailRegex } from '../../../../shared/constants/patterns';
import { statusCodes } from '../../../../shared/constants/services';
import { ICompanyData } from '../../../../shared/models/company-data';

@Component({
  selector: 'cs-empresa-gtp',
  templateUrl: './empresa-gtp.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextModule,
    KeyFilterModule,
    TextareaModule,
    RadioButtonModule,
    ButtonDirective,
    Ripple,
  ],
})
export class EmpresaGTPComponent implements OnInit {
  private readonly formBuilder = inject(UntypedFormBuilder);

  formGroup: UntypedFormGroup;
  submitted = false;
  statusCodes: Record<string, number> = statusCodes;
  errorMessages = {
    email: {
      required: 'El correo electrónico  es obligatorio',
      pattern: 'Ingrese un correo electrónico  válido',
      minlength: 'El correo electrónico debe tener mínimo 10 caracteres',
    },
    movilNumber: {
      required: 'Teléfono o celular es obligatorio',
      pattern: 'Teléfono o celular es obligatorio',
      minlength: 'El teléfono o celular debe tener mínimo 9 dígitos',
    },
  };

  readonly enterprise = input<ICompanyData>(undefined);
  readonly grabar = output<ICompanyData>();

  ngOnInit() {
    const {
      NombreApproved,
      ruc,
      movilOperator,
      email,
      newName,
      movilNumber,
      newNameGTPStatus,
      entryName,
    } = this.enterprise();

    const isNotEditable = newNameGTPStatus === statusCodes.APPROVED;

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
        { value: newNombreApprovedValue, disabled: isNotEditable },
        Validators.required,
      ],
      entry: new UntypedFormControl({
        value: entryName,
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
        value: operator?.label,
        disabled: true,
      }),
    });
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
      const isNotEditable =
        this.enterprise().newNameGTPStatus !== statusCodes.APPROVED;
      let dataEnterprise: ICompanyData;
      if (isNotEditable) {
        dataEnterprise = {
          ...this.enterprise(),
          NombreApproved: value.NewNameApproved === 'S',
        };
      } else {
        dataEnterprise = { ...this.enterprise(), ...value };
      }
      this.grabar.emit(dataEnterprise);
    }
  }
}
