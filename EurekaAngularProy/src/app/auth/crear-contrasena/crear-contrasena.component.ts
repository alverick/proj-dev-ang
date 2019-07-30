import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MustMatch } from './must-match.validator';

@Component({
  selector: 'app-crear-contrasena',
  templateUrl: './crear-contrasena.component.html',
  styleUrls: ['./crear-contrasena.component.css']
})
export class CrearContrasenaComponent implements OnInit {


  registerForm: FormGroup;
  submitted = false;


  constructor(private formBuilder: FormBuilder) { }


  ngOnInit() {
      this.registerForm = this.formBuilder.group({
        ruc: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefono:  ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        rememberme:  [false, Validators.required],
    }, {
        validator: MustMatch('password', 'confirmPassword')
    });
}

 // Obtención de conveniencia para un fácil acceso a los campos de formulario
     get f() { return this.registerForm.controls; }

     onSubmit() {
         this.submitted = true;

         // stop here if form is invalid
         if (this.registerForm.invalid) {
             return;
         }

         alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
     }



}
