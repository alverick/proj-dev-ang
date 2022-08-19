import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RubroModel } from 'src/app/shared/models';
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
  rubros: RubroModel[] = [];
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

    const newNombreApprovedValue =
      NombreApproved === undefined ? '' : NombreApproved === true ? 'S' : 'N';

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
        disabled: isNotEditable,
      }),
      email: new FormControl({
        value: email,
        disabled: isNotEditable,
      }),
      movilNumber: new FormControl({
        value: movilNumber,
        disabled: isNotEditable,
      }),
      movilOperator: new FormControl({
        value: movilOperator,
        disabled: isNotEditable,
      }),
    });
  }

  get f(): any {
    return this.formGroup.controls;
  }

  onSubmitEmpresa() {
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
