import { Component, OnInit, Directive, ViewChild} from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Directive({
  selector: '[appBlockCopyPaste]'
})



export class LoginComponent implements OnInit {

  public  loginForm: FormGroup;
  public  submitted: Boolean = false;
  public  error: {ruc: string, message: string} = null;
  public  respuestaHttp: number;
  public  formData: any = {};
  public  rememberMe: boolean = false;

  public  inputUsuario: boolean = false;
 // @ViewChild('inputUsua') inputUsua: ElementRef;
 // @ViewChild('inputPass') inputPass: ElementRef;
  inputUsuaValid: boolean = false;
  inputPassValid: boolean = false;
  validarCantRuc: boolean = false;
  validarCantPass: boolean = false;

  intentos: number;
  intentosRestantes: number = 6;
  codRespuesta: number;
  err: boolean;
  numero2: number;
  intento6: boolean =false;
  ruc: number=0;

  isTrue: boolean = false;
  codigo2: boolean = false;
  isCaptchaValidate: boolean = true;

  storeRuc : any ;

  @ViewChild("recaptchaRef", { static: true })
  recaptchaRef: RecaptchaComponent;

  account_validation_messages = {
    'ruc': [
      // hasError
      { type: 'required', message: 'Debes ingresar un RUC' },
     // { type: 'minlength', message: 'Ingrese un RUC válido de 11 dígitos' },
      { type: 'pattern', message: 'Debe contener solo números' },
    ],
    'psw': [
      { type: 'required', message:  'Debe ingresar el password' },
      //{ type: 'minlength', message: 'Debes ingresar una contraseña entre 6 y 20 caracteres' },
      { type: 'maxlength', message: 'Debes ingresar una contraseña entre 6 y 20 caracteres'},
    ]
  }


  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cookieService : CookieService,
    private storageService: StorageService,
    public  snackBar: MatSnackBar
    ) {}

  ngOnInit() {
    this.snackBar.dismiss();
    let rucStr = this.cookieService.check('ruc') ? this.cookieService.get('ruc') :  '';

   
    this.validationLogin(rucStr);
   // this.validaInputs();
  }



    validationLogin(rucStr: any) {
    if (rucStr) {
      this.rememberMe = true;
    }
    
    this.loginForm = this.formBuilder.group({
      ruc: [rucStr, Validators.compose([Validators.required,
             Validators.pattern('^[0-9]*$')  ])   ],
      psw: ['', Validators.required ],
      rememberme: [this.rememberMe, Validators.required]
    });

  }

  get f() { return this.loginForm.controls; }

  resolved(captchaResponse: string) : boolean{
    
    this.isCaptchaValidate = true;
    return true;
  }

  mensaje(tipo: any, titulo: string, text: string){
    Swal.fire({
      type: tipo ,
      title: titulo ,
      text: text,
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: '#d33',
      cancelButtonText:  'Cerrar',
      allowOutsideClick: false,
    });
  }

  focusFunctionRuc(){
    this.inputUsuaValid = false;
    this.validarCantRuc = false;
    this.codigo2=false;
  }
  focusFunctionPass(){
    this.inputPassValid = false;
    this.validarCantPass =false;
    this.codigo2=false;
  }

  /* /////// L O G I N ////////////  */
  public try(): void{

  }

  public submitLogin() : any {


    

    let continuar = true;

    if (this.loginForm.get('ruc').value.length === 0) {
      this.inputUsuaValid =true;
      continuar = false;
    }
    else if (this.loginForm.get('ruc').value.length < 11) {
      this.validarCantRuc = true;
      continuar = false;
    }

    if (this.loginForm.get('psw').value.length === 0) {
      this.inputPassValid =true;
      continuar = false;
    }
    else if (this.loginForm.get('psw').value.length < 6 || this.loginForm.get('psw').value.length > 20) {
      this.validarCantPass = true;
      continuar = false;
    }

    if (!continuar)
      return;

    this.cookieService.delete('ruc');
     
    if(this.loginForm.valid && this.isCaptchaValidate){
      this.spinner.show();
      
      this.loginService.login(this.f.ruc.value, this.f.psw.value)
      .pipe(first())
      .subscribe(
        value => {
           
          this.storageService.setIntentos(value.paramNum);
          this.intentos = this.storageService.getIntentos();

          this.intentosRestantes= 6 - this.intentos;
          this.codRespuesta= value.codRespuesta;
          if(value.paramStr==="Un session ya se encuentra activa"){
            Swal.fire({
              imageUrl: '/assets/images/complain.svg',
              imageHeight: 100,
              title:'Existe una Sesión Activa',
              cancelButtonText: 'Cerrar',
              cancelButtonColor: '#d33',
              showCloseButton: true,
              allowOutsideClick: false
            })
          }else if(value.estado===true && this.intentos<=6){
                   
                  if(this.rememberMe==true){
                      const expire = new Date();
                      expire.setDate(expire.getDate() + 25);
                      this.cookieService.set('ruc', this.f.ruc.value, expire);
                  }

                      this.router.navigate(['/home']);
                      this.spinner.hide();
          }else if(this.intentos < 4 && this.codRespuesta == 2 ){
             
            this.codigo2=true;
          }else if(this.intentos< 4 && this.codRespuesta == 3){
            this.codigo2= false;
           
            this.mensaje( 'error', 'Contraseña Incorrecta',
            'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentosRestantes+' intentos restantes' );
          }else if(this.intentos< 4 && this.codRespuesta == 5){
            this.codigo2= false;
             
            this.mensaje( 'error', 'Cuenta Inactiva',
            'Su cuenta se encuentra inactiva' );

          }else if(this.intentos == 4 && this.codRespuesta == 2){
             
            this.loginService.errores= value.codRespuesta;
            this.isCaptchaValidate = false;
            this.recaptchaRef !== undefined ? this.recaptchaRef.reset() : null;
            this.isTrue = true;
            this.codigo2=true;

          }else if(this.intentos == 4 && this.codRespuesta == 3){
            this.codigo2= false;
            

            this.mensaje( 'error', 'Contraseña Incorrecta',
            'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentosRestantes+' intentos restantes' );

            this.isCaptchaValidate = false;
            this.recaptchaRef !== undefined ? this.recaptchaRef.reset() : null;
            this.isTrue = true;
          }else if(this.intentos == 4 && this.codRespuesta == 5){
            this.codigo2= false;
            

            this.mensaje( 'error', 'Cuenta Inactiva',
            'Su cuenta se encuentra inactiva' );

            this.isCaptchaValidate = false;
            this.recaptchaRef !== undefined ? this.recaptchaRef.reset() : null;
            this.isTrue = true;

          }else if(this.intentos == 5 && this.codRespuesta == 2){
            
            this.isTrue = true;
            this.codigo2=true;

          }
          else if(this.intentos == 5 && this.codRespuesta == 3){
            this.codigo2= false;
            
            this.mensaje( 'error', 'Contraseña Incorrecta','Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentosRestantes+' intentos restantes');
            this.recaptchaRef !== undefined ? this.recaptchaRef.reset() : null;
            this.isCaptchaValidate = false;
            this.isTrue = true;
            this.codigo2= false;
          }
          else if(this.intentos == 5 && this.codRespuesta == 5){
            this.codigo2= false;
             
            this.mensaje( 'error', 'Cuenta Inactiva','Su cuenta se encuentra inactiva');
            this.recaptchaRef !== undefined ? this.recaptchaRef.reset() : null;
            this.isCaptchaValidate = false;
            this.isTrue = true;
            this.codigo2= false;
          }
          else if(this.intentos >= 6 || value.paramStr==='Vuelva a intentarlo mas tarde' || value.paramStr==='El usuario esta bloqueado'){
            this.codigo2= false;
            
            this.mensaje( 'error', 'Contraseña Incorrecta','Tu cuenta ha sido bloqueada por seguridad, inténtalo nuevamente en 60 minutos. Si tienes problemas para ingresar a tu cuenta, contáctanos a pilotos@intercorp.com.pe '  );
            this.intento6= true;
            this.isTrue = false;
          }
        },
      error =>{
        this.spinner.hide();
        if(error.status ===500){
          this.mensaje( 'error', 'Error', 'Error del Servidor comuniquese con el administrador');

        }
      },
      () => this.spinner.hide()
    );
  }
}

}
