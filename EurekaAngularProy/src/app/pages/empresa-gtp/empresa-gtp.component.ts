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
/*
ruc:12345678912,
    name:'nombre actual',
    entry: 'Colegios', 
    email: 'mnievafra@gmail.com',
    movilNumber: 123456 , 
    newName:'Nuevo Nombre', 
    status: 'modificacion', 
    uniqueCodeIBK: '1321321', 
    requestDate:new Date(Date.now()),
    NombreApproved: null
*/


  ngOnInit() {
    console.table(this._enterprise);
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);

    this.formGroup = this.formBuilder.group({
      ruc: new FormControl({ value: this._enterprise.ruc, disabled: true }),
      newName: new FormControl({ value: this._enterprise.newName, disabled: true }), 
      NewNameApproved:  new FormControl({value: (this._enterprise.NombreApproved == true? 'S':'N')},   [Validators.required]),
      entry: new FormControl({ value: this._enterprise.entry, disabled: true }),
      email: new FormControl({ value: this._enterprise.email, disabled: true }),
      movilNumber: new FormControl({ value: this._enterprise.movilNumber, disabled: true }), 
    });
  }
 
  get f(): any { return this.formGroup.controls; }
 
  onSubmitEmpresa(){
    if (this.formGroup.valid)
      {
          let value: DataEnterpriseGTP;
          value = this._enterprise; 
          value.NombreApproved = (this.formGroup.value.NewNameApproved =='S'); 
        /*  console.table(value);
          console.log('Aprobado');
          console.log(this.formGroup.value.NewNameApproved =='S'?true:false); */
          this.grabar.emit(value);
      } 
  }


}
