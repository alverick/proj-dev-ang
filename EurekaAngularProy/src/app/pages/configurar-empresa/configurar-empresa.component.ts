import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/auth/crear-contrasena/must-match.validator';
import { ConfiguracionService } from 'src/app/shared/services/configuracion.service';
import Swal from 'sweetalert2';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { RubroModel } from 'src/app/shared/models';
import { Router } from '@angular/router';
import { drawPopup } from 'src/app/shared/services/popups';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';


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
              public afiliacionService: AfiliacionService,
              private router: Router,
              private gaService: GoogleAnalytics) { }

    @HostListener('window:beforeunload', ['$event'])
    public closeWindow($event: any) {
      if (!this.afiliacionService.Guardado) {
        $event.returnValue = 'Se van a perder los cambios.';
      }
    }

  ngOnInit() {
    this.createForm();
    this.getInfoEmpresa();
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
  }


  getInfoEmpresa() {
    this.configEmpresaService.getDatosEmpresa()
      .subscribe( dataEnterprise => {
        this.formGroup.setValue(dataEnterprise);
      }
  );
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      ruc: new FormControl({ value: '', disabled: true }),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
      entry: new FormControl({ value: '', disabled: true }),
      email: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'), Validators.minLength(10), Validators.maxLength(100)]),
      movilNumber: new FormControl('', [Validators.required, Validators.pattern('^([9][0-9]{8})?([1-8][0-9]{5,6})?$'), Validators.minLength(6), Validators.maxLength(9)]),
      password: new FormControl('',   [Validators.minLength(6), Validators.maxLength(20) ]),
      newPassword: new FormControl('',[Validators.minLength(6), Validators.maxLength(20), UnaLetra]),
      confirmNewPassword: new FormControl('',[Validators.minLength(6), Validators.maxLength(20), UnaLetra]),
    }, {
      validator: ValidateConfigEmpresa()
    });
  }

  get f(): any { return this.formGroup.controls; }


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
    this.submitted = true;

    var correo =  parseInt(this.formGroup.value.email.toString().length);

    var Pass =  parseInt(this.formGroup.value.password.toString().length);
    var newPass =  parseInt(this.formGroup.value.newPassword.toString().length);

    if (this.formGroup.valid) {
       if(correo==0){
        return;
      }
       if(!this.formGroup.value.email.toString().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        this.mensaje('warning','Edicion de Empresa','Debe ingresar un email valido' );
        return;
      }

      if(newPass > 0 &&  Pass == 0){
        this.mensaje('warning','Edicion de Empresa','Debe ingresar su contraseña Actual para continuar' );
        return;
      }
      if(Pass > 0 && newPass == 0){
        this.mensaje('warning','Edicion de Empresa','Debe ingresar la nueva contraseña para continuar' );
        return;
      }
      const datosEmpresa = this.formGroup.value;
      const enterprise = {
        ruc: datosEmpresa.ruc,
        email: datosEmpresa.email,
        movilNumber: datosEmpresa.movilNumber,
        password: datosEmpresa.password,
        newPassword: datosEmpresa.newPassword,
        confirmNewPassword: datosEmpresa.confirmNewPassword
      };
      this.configEmpresaService.saveDatosEmpresa(enterprise).
        subscribe(
        enterpriseUpdate => {
          console.table(enterpriseUpdate);
          if( enterpriseUpdate.success == true ){
            this.gaService.sendEvent('ActualizaDatosEmpresa', {
              'event_category': 'Configuración',
              'event_label': 'actualiza_datos_empresa'
            });;
            Swal.fire({
              title: 'Datos de Empresa guardados',
              text: 'Sus datos han sido actualizados',
              showCloseButton: true,
              confirmButtonText: 'ACEPTAR',
              onOpen: drawPopup

            }).then((result) => {
              if (result.value) {
                onAfterClose: () => {
                  datosEmpresa.email = datosEmpresa.newEmail;
                  datosEmpresa.movilNumber = datosEmpresa.newMovilNumber;
                  datosEmpresa.password = datosEmpresa.newPassword;
                }
                this.router.navigate(['/home']);
              }
            })


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
      title: titulo ,
      text: text,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText:  'CERRAR',
      onOpen: drawPopup

    });
  }


}



function ValidateConfigEmpresa() {
  var validPwd = MustMatch('newPassword', 'confirmNewPassword');
  return (f: FormGroup) => {
    validPwd(f);
    if (f.get('password').value && f.get('newPassword').value && f.get('newPassword').value ===  f.get('password').value){
      f.get('newPassword').setErrors({ equalPwd: true});
    }
    else if (f.get('newPassword').hasError('equalPwd')) {
      f.get('newPassword').errors['equalPwd'] = null;
    }
    ValidateNewPasswordRequired(f);
  }
}

function UnaLetra(c: FormControl) {
  let regex = /[a-zA-Z]/g;
  if (c.value && !regex.test(c.value)) {
    return { unaletra: true };
  }
  return null;
}

function ValidateNewPasswordRequired(f: FormGroup) {
  let pwdCtrl = f.get('password');
  let newPwdCtrl = f.get('newPassword');
9
  /*if (pwdCtrl.valid && pwdCtrl.dirty && pwdCtrl.value) {
    if (!newPwdCtrl.value) {
      newPwdCtrl.markAsDirty();
      newPwdCtrl.setErrors({
        reqNewPwd: true
      });
    }
    else {
      newPwdCtrl.setErrors(null);
    }
  }
  else if (newPwdCtrl.errors && newPwdCtrl.errors.reqNewPwd) {
    newPwdCtrl.setErrors(null);
  }*/

  /*if (newPwdCtrl.valid && newPwdCtrl.dirty) {
    if (!pwdCtrl.value) {
      pwdCtrl.markAsDirty();
      pwdCtrl.setErrors({
        reqPwd: true
      });
    }
    else {
      if (pwdCtrl.errors) {
        delete pwdCtrl.errors.reqPwd;
      }
    }
  }*/
}
7
