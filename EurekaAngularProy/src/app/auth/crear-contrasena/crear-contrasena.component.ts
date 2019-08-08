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
    this.registerForm = this.formBuilder.group({
      ruc: new FormControl('', Validators.required),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
      rubro: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required]),
      contrasena: new FormControl('', [Validators.required]),
      repcontrasena: new FormControl('', Validators.required),
      acceptterms: new FormControl(false, Validators.required)
    }, {
      validator: MustMatch('contrasena', 'repcontrasena')
    });
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
  }

  // Obtención de conveniencia para un fácil acceso a los campos de formulario
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    console.log(this.registerForm.valid);
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    if (this.registerForm.value.acceptterms == false) {
      Swal.fire({
        type: 'warning',
        text: 'Debe aceptar los terminos y condiciones'
      });
      return;
    }

    this.afiliacionService.Registrar({
      ruc: this.registerForm.value.ruc,
      email: this.registerForm.value.email,
      entry: this.registerForm.value.rubro,
      movilNumber: this.registerForm.value.telefono,
      password: this.registerForm.value.contrasena,
      acceptTerms: this.registerForm.value.acceptterms
    }).subscribe(d => {
      if (d.success) {
        this.router.navigate(["/configurarServicios"]);
      } else {
        Swal.fire({
          type: 'error',
          text: d.message
        });
      }
    }, err => {
      console.log(err);
      Swal.fire({
        type: 'error',
        html: 'Ha ocurrido un error con el servidor<br />Intente de nuevo'
      });
    });
  }
}
