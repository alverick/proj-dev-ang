import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
 import CUSTOM_ELEMENTS_SCHEMA from '@angular/core';
import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';
import { EnterprisesGtp } from 'src/app/shared/models/enterprises-gtp';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { RubroModel } from 'src/app/shared/models';

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
  @Input() set enterprise(value: DataEnterpriseGTP){
    this._enterprise = value;
  }
  @Output() grabar = new EventEmitter<any>();

  constructor(public afiliacionService: AfiliacionService,private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.table(this._enterprise);
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);

    this.formGroup = this.formBuilder.group({
      ruc: new FormControl({ value: this._enterprise.Ruc, disabled: true }),
      newName: new FormControl({ value: this._enterprise.NewName, disabled: true }), 
      NewNameApproved:  new FormControl('',   [Validators.required]),
      entry: new FormControl({ value: this._enterprise.Entry, disabled: true }),
      email: new FormControl({ value: this._enterprise.Email, disabled: true }),
      movilNumber: new FormControl({ value: this._enterprise.MovilNumber, disabled: true }), 
    });
  }
 
  get f(): any { return this.formGroup.controls; }



  onSubmitEmpresa(){
    if (this.formGroup.valid)
    {
        let value: DataEnterpriseGTP;
        value = this._enterprise;
        value.Ruc = this.formGroup.value.ruc;
        value.NewName = this.formGroup.value.newName;
        value.NewNameApproved = this.formGroup.value.NewNameApproved;
        value.Entry = this.formGroup.value.entry;
        value.Email = this.formGroup.value.email;
        value.MovilNumber = this.formGroup.value.MovilNumber;
        console.table(value);
        this.grabar.emit(value);
    }

  }


}
