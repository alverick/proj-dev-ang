import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/auth/crear-contrasena/must-match.validator';
import { ConfiguracionService } from 'src/app/shared/services/configuracion.service';
import { DataEnterpriseModel } from 'src/app/shared/models/data-enterprise.model';
import Swal from 'sweetalert2';
import { stringify } from '@angular/core/src/render3/util';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { RubroModel } from 'src/app/shared/models';
import { DISABLED } from '@angular/forms/src/model';


@Component({
  selector: 'app-configurar-empresa',
  templateUrl: './configurar-empresa.component.html',
  styleUrls: ['./configurar-empresa.component.scss']
})
export class ConfigurarEmpresaComponent implements OnInit {

  // public configurarE,mpresaForm: FormGroup;
  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';
  submitted: boolean= false;
  butDisabled: boolean = true;
  rubros: RubroModel[] = [];
  constructor(private formBuilder: FormBuilder,
              private configEmpresaService: ConfiguracionService,
              public afiliacionService: AfiliacionService) { }

  ngOnInit() {
    this.createForm();
    this.getInfoEmpresa();
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
  }


  getInfoEmpresa() {
    this.configEmpresaService.getDatosEmpresa()
      .subscribe( dataEnterprise => {
        console.table(  dataEnterprise);
        this.formGroup.setValue(dataEnterprise);
      }
  );
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      ruc: new FormControl(''),
      name: new FormControl(''),
      entry: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      movilNumber: new FormControl('', [Validators.required]),
      password: new FormControl('',   [Validators.minLength(6), Validators.maxLength(20)]),
      newPassword: new FormControl('',[Validators.minLength(6), Validators.maxLength(20)]),
      confirmNewPassword: new FormControl('',[Validators.minLength(6), Validators.maxLength(20)]),
    }, {
      validator: MustMatch('newPassword', 'confirmNewPassword')
    });
  }

  get f() { return this.formGroup.controls; }


  getErrorEmail() {
    return this.formGroup.get('email').hasError('required') ? 'Email es requerido' :
      this.formGroup.get('email').hasError('email') ? 'No es un Email válido' :'';
  }

  getErrorPhone() {
    return this.formGroup.get('movilNumber').hasError('required') ? 'Télefono es requerido' : '';
  }

  getErrorPassword() {
    return this.formGroup.get('password').hasError('required') ? 'La Contraseña es requerida' :''  }


  getErrorNewPassword() {
    return this.formGroup.get('newPassword').hasError('required') ? 'La Contraseña es requerida' :''  }

  getErrorConfirmNewPassword() {
    return this.formGroup.get('confirmNewPassword').hasError('required') ? 'La Contraseña es requerida' :''  }

// actualizado
  onSubmit() {


    if(!this.formGroup.value.email.toString().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
      this.mensaje('warning','Edicion de Empresa','Debe ingresar un email valido' );
      return;
    }
  

    this.submitted = true;
    console.log("ENTRO  ");
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      const datosEmpresa = this.formGroup.value;
      const enterprise = {
        ruc: datosEmpresa.ruc,
        email: datosEmpresa.email,
        movilNumber: datosEmpresa.movilNumber,
        password: datosEmpresa.password,
        newPassword: datosEmpresa.newPassword,
        confirmNewPassword: datosEmpresa.confirmNewPassword
      };
      console.log("FORM GROUP : "+this.formGroup.valid);
      console.log(enterprise);
      this.configEmpresaService.saveDatosEmpresa(enterprise).
        subscribe(
        enterpriseUpdate =>{
          console.table(enterpriseUpdate);
          if( enterpriseUpdate.success == true ){
            Swal.fire({
              type: 'success',
              title: 'Datos de empresa guardados',
              text: 'Sus datos han sido actualizados',
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false,
              onAfterClose: () => {
                datosEmpresa.email = datosEmpresa.newEmail;
                datosEmpresa.movilNumber = datosEmpresa.newMovilNumber;
                datosEmpresa.password = datosEmpresa.newPassword;
              }
            });
          }
         if(enterpriseUpdate.success == false ) {
          this.mensaje('warning','Edicion de Empresa','La contraseña no coincide con la contraseña actual' );
          return;
         }
         
          
        }
      );
    }
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
