import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable }    from 'rxjs/Observable';
import { MustMatch } from 'src/app/auth/crear-contrasena/must-match.validator';


@Component({
  selector: 'app-configurar-empresa',
  templateUrl: './configurar-empresa.component.html',
  styleUrls: ['./configurar-empresa.component.scss']
})
export class ConfigurarEmpresaComponent implements OnInit {

  //public configurarE,mpresaForm: FormGroup;
  formGroup: FormGroup
  titleAlert: string = 'This field is required';
  post: any = '';
  submitted: boolean= false;

  constructor(private formBuilder: FormBuilder) { }



  ngOnInit() {
    this.createForm();
  }

  
  
    createForm() {
      this.formGroup = this.formBuilder.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', [Validators.required]),
        password:new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        confirmNewPassword:new FormControl('', [Validators.required]),
       },{          
            validator: MustMatch('newPassword', 'confirmNewPassword')
        });
  }

  get f() { return this.formGroup.controls; }


  getErrorEmail() {
    return this.formGroup.get('email').hasError('required') ? 'Email es requerido' :
      this.formGroup.get('email').hasError('email') ? 'No es un Email válido' :'';
  }
  
  getErrorPhone(){
    return this.formGroup.get('phone').hasError('required') ? 'Télefono es requerido' : '';
  }

  getErrorPassword() {
    return this.formGroup.get('password').hasError('required') ? 'La Contraseña es requerida' :''  }

    
  getErrorNewPassword() {
    return this.formGroup.get('newPassword').hasError('required') ? 'La Contraseña es requerida' :''  }

  getErrorConfirmNewPassword() {
    return this.formGroup.get('confirmNewPassword').hasError('required') ? 'La Contraseña es requerida' :''  
  }


  onSubmit(post) {
    this.submitted = true;

    console.log(this.formGroup.valid);

    if(this.formGroup.invalid){
      return;
    }

    
  }


}
