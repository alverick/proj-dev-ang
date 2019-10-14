import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
   public formulario :boolean =true;
   recupera: FormGroup;
   public  submitted: Boolean = false;

  ngOnInit() {

    this.recupera = this.formBuilder.group({
      ruc: new FormControl('',  [Validators.required,  Validators.pattern('[1-2]0[0-9]+?'), Validators.minLength(11)]),
      email:new FormControl('',  [Validators.required , Validators.pattern('^[A-Za-z0-9]{1,}([-._]{1}[A-Za-z0-9]{1,})?@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'), Validators.minLength(10), Validators.maxLength(100)]),
      captcha: new FormControl( '',  [Validators.required])
    });
    
  }


  get f(): any {
    return this.recupera.controls;
  }

  SubmitRecupera(){ 

    if(this.recupera.valid){
      alert('es valido');
    }
  }

}
