import { FormControl, Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '../crear-contrasena/must-match.validator';

@Component({
  selector: 'app-cambia-contrasena',
  templateUrl: './cambia-contrasena.component.html',
  styleUrls: ['./cambia-contrasena.component.scss']
})
export class CambiaContrasenaComponent implements OnInit {

  public llave: string;
  constructor(public formBuilder: FormBuilder, private rutaActiva: ActivatedRoute, private router: Router) { }
  public Cambia: FormGroup;
  ngOnInit() {
    this.Cambia = this.formBuilder.group({ 
        contrasena: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), UnaLetra]),
        repcontrasena: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), UnaLetra]),
    }, {
      validator: MustMatch('contrasena', 'repcontrasena')
    })
    this.llave =  this.rutaActiva.snapshot.params.llave;
    console.log('cambia contraseña');
    console.log(this.llave);

   /* if(this.llave ='1'){
      this.router.navigate(['/login']);
    } 
    */
  }

  
  get f():any{
    return this.Cambia.controls;
  }

  SubmitCambia(){

  }

}


function UnaLetra(c: FormControl) {
  let regex = /[a-zA-Z]/g;
  if (c.value && !regex.test(c.value)) {
    return { unaletra: true };
  }
  return null;
}
