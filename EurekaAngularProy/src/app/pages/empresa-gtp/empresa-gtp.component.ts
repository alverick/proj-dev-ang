import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
 import CUSTOM_ELEMENTS_SCHEMA from '@angular/core';
import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';
import { EnterprisesGtp } from 'src/app/shared/models/enterprises-gtp';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { RubroModel } from 'src/app/shared/models';
import { GtpService } from 'src/app/shared/services/gtp.service';

@Component({
  selector: 'app-empresa-gtp',
  templateUrl: './empresa-gtp.component.html',
  styleUrls: ['./empresa-gtp.component.scss'
  ],

})
export class EmpresaGTPComponent implements OnInit {
  private _enterprise: DataEnterpriseGTP;
  formGroup: FormGroup;
  rubros: RubroModel[] = [];
  @Input() set enterprise(value: DataEnterpriseGTP) {
    this._enterprise = value;
  }
  @Output() grabar = new EventEmitter<any>();

  constructor(public afiliacionService: AfiliacionService, private formBuilder: FormBuilder, public gtpService: GtpService) { }

  ngOnInit() {
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);

    this.formGroup = this.formBuilder.group({
      ruc: new FormControl({ value: this._enterprise.ruc, disabled: true }),
      newName: new FormControl({ value: this._enterprise.newName, disabled: true }),
      // tslint:disable-next-line:max-line-length
      NewNameApproved:  [(this._enterprise.NombreApproved === undefined) ? '' : (this._enterprise.NombreApproved === true ? 'S' : 'N'), Validators.required],
      entry: new FormControl({ value: this._enterprise.entry, disabled: true }),
      email: new FormControl({ value: this._enterprise.email, disabled: true }),
      movilNumber: new FormControl({ value: this._enterprise.movilNumber, disabled: true }),
      movilOperator: new FormControl({ value: this._enterprise.movilOperator, disabled: true })
    });
  }

  get f(): any { return this.formGroup.controls; }

  onSubmitEmpresa() {

    if (this.formGroup.valid) {
          let value: DataEnterpriseGTP;
          value = this._enterprise;
          value.NombreApproved = (this.formGroup.value.NewNameApproved === 'S');
          this.grabar.emit(value);
      }
  }

}
