import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MustMatch } from './must-match.validator';
import { AfiliacionService } from '../../shared/services/afiliacion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RubroModel } from 'src/app/shared/models';

@Component({
  selector: 'app-crear-contrasena',
  templateUrl: './crear-contrasena.component.html',
  styleUrls: ['./crear-contrasena.component.css']
})
export class CrearContrasenaComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private afiliacionService: AfiliacionService,
    private router: Router
  ) {}

  rubros: RubroModel[] = [];

  ngOnInit() {
    window['_url_loop_'] = 'crearContrasena';
    this.registerForm = this.formBuilder.group({
      ruc: new FormControl('',  [Validators.required,  Validators.pattern('[1-2]0[0-9]+?'), Validators.minLength(11)]),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
      rubro: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required , Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'), Validators.minLength(10), Validators.maxLength(100)]),
      telefono: new FormControl('', [Validators.required,Validators.pattern('^([9][0-9]{8})?([1-8][0-9]{5,6})?$'), Validators.minLength(6), Validators.maxLength(9)]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      repcontrasena: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      acceptterms: new FormControl(false, Validators.requiredTrue)
    }, {
      validator: MustMatch('contrasena', 'repcontrasena')
    });
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
  }

  // Obtención de conveniencia para un fácil acceso a los campos de formulario
  get f(): any {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    var ruc  = this.registerForm.value.ruc.toString();
    console.log('RUC --->'+  ruc.substring(0,2));
    // stop here if form is invalid

    if (this.registerForm.invalid) {
      return;
    }
    if( parseInt(ruc.substring(0,2)) == 20  ||  parseInt(ruc.substring(0,2)) == 10 ){

    }else{
      this.mensaje('warning','Registrame','Debe ingresar un Ruc valido' );
      return;
    }

    if(!this.registerForm.value.email.toString().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
      this.mensaje('warning','Registrame','Debe ingresar un email valido' );
      return;
    }


   //  if(this.registerForm.value.ruc)
    if (this.registerForm.value.acceptterms == false) {

      this.mensaje('warning','Registrame','Debe aceptar los terminos y condiciones' );

      return;
    }
     
    this.afiliacionService.Registrar({
      ruc: this.registerForm.value.ruc,
      name: this.registerForm.value.nombre,
      entry: this.registerForm.value.rubro,
      email: this.registerForm.value.email,
      movilNumber: this.registerForm.value.telefono,
      password: this.registerForm.value.contrasena,
      acceptTerms: this.registerForm.value.acceptterms
    }).subscribe(d => {
      if (d.success) {
        this.router.navigate(["/configurarServicios"/*, this.registerForm.get('ruc')*/]);
      } else {
        if (d.code === 1) {
          Swal.fire({
            type: 'warning',
            title: 'Crea tu cuenta',
            text: `El RUC: ${this.registerForm.value.ruc} ya se encuentra registrado en Eureca`,
            showConfirmButton: false,
            showCancelButton: true,
            showCloseButton: true,
            cancelButtonText: 'Cerrar'
          });
        }
        else {
          Swal.fire({
            type: 'warning',
            title: 'Crea tu cuenta de negocios',
            text: `No tenemos ninguna cuenta asociada al RUC: ${this.registerForm.value.ruc}. Para continuar crea primero tu cuenta negocios y puedas cobrar tus servicios ahí`,
            showConfirmButton: true,
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText: 'Crear mi cuenta',
            cancelButtonText: 'Corregir mi RUC'
          }).then(res => {
            if (res.value) {
              window.open('https://interbank.pe/cuenta-negocios');
            }
          });
        }
      }
    }, err => {
      console.log(err);

      this.mensaje('error','Registrame','Ha ocurrido un error con el servidor<br />Intente de nuevo' );

    });
  }

  mensaje(tipo: any, titulo: string, text: string){
    Swal.fire({
      type: tipo ,
      title: titulo ,
      html: text,
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: '#d33',
      cancelButtonText:  'Cerrar',

    });
  }


}
