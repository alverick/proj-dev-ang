import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-configurar-empresa',
  templateUrl: './configurar-empresa.component.html',
  styleUrls: ['./configurar-empresa.component.scss']
})
export class ConfigurarEmpresaComponent implements OnInit {

  public configurarEmpresaForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder) { }

  get f(){ return this.configurarEmpresaForm.controls}

  validations ={
    'email':[
      {type: 'required', message: 'Email es requerido'},
      {type: 'pattern', message: 'Entra un Email válido '}
    ]
  }

  ngOnInit() {
    this.configurarEmpresaForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),      
      tel: ['', Validators.compose([Validators.required])],
      psw: ['', Validators.compose([Validators.required])],
      repeatPsw : ['', Validators.compose([Validators.required])]
    })
  
  }

  public submitEnterprise(){
    console.log("E N T R O");
    if(this.configurarEmpresaForm.valid){
      alert("datos correctos");
    }


  }

}
