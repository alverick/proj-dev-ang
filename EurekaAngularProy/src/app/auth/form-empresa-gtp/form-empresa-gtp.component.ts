import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
 import CUSTOM_ELEMENTS_SCHEMA from '@angular/core';
import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';
import { EnterprisesGtp } from 'src/app/shared/models/enterprises-gtp';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { RubroModel } from 'src/app/shared/models';
import { GtpService } from 'src/app/shared/services/gtp.service';

@Component({
  selector: 'app-frm-empresa-gtp',
  templateUrl: './form-empresa-gtp.component.html',
  styleUrls: ['./form-empresa-gtp.component.scss']
})
export class FormEmpresaGTPComponent implements OnInit {
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
      cu: new FormControl(this._enterprise.uniqueCodeIBK, [Validators.required, Validators.pattern('[0-9]*')]),
      ruc: new FormControl(this._enterprise.ruc, [Validators.required, Validators.pattern('[1-2]0[0-9]+?'), Validators.minLength(11)]),
      newName: new FormControl(this._enterprise.newName, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
      entry: new FormControl(this._enterprise.entry, [Validators.required]),
      email: new FormControl(this._enterprise.email, [Validators.required , Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.minLength(10), Validators.maxLength(100)]),
      movilNumber: new FormControl(this._enterprise.movilNumber, [Validators.required,Validators.pattern(/^([9][0-9]{8})?([1-8][0-9]{5,6})?$/), Validators.minLength(6), Validators.maxLength(9)])
    });
  }

  get f(): any { return this.formGroup.controls; }

  onSubmitEmpresa() {

    let entryName = this.rubros.find(r => r.code === this.f.entry.value).name;
    if (this.formGroup.valid) {
          let value: DataEnterpriseGTP;
          value = this._enterprise;
          value.cu = this.f.cu.value;
          value.ruc = this.f.ruc.value;
          value.newName = this.f.newName.value;
          value.entry = this.f.entry.value;
          value.entryName = entryName;
          value.email = this.f.email.value;
          value.movilNumber = this.f.movilNumber.value;
          value.NombreApproved = true;
          value.inReview = false;
          this.grabar.emit(value);
      }
  }

  onBlurCu(e) {
    let cu = this.f.cu.value.replace(/[^0-9]*/g, '');
    if (cu !== '') {
      while (cu.length < 10) {
        cu = '0' + cu;
      }
      this.f.cu.setValue(cu);
    }
  }

}
