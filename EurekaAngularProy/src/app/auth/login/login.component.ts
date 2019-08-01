import { Component, OnInit, HostListener, Directive, ViewChild, ElementRef} from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { RecaptchaComponent } from 'ng-recaptcha';

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
  @ViewChild('inputUsua') inputUsua: ElementRef;
  @ViewChild('inputPass') inputPass: ElementRef;
  inputUsuaValid: boolean = false;
  inputPassValid: boolean = false;
  validarCantRuc: boolean = false;

  intentos: number;
  intentosRestantes: number = 6;
  codRespuesta: number;
  err: boolean;
  numero2: number;
  checked: boolean = false;
  intento6: boolean =false;
  ruc: number=0;

  isTrue: boolean = false;
  codigo2: boolean = false;
  isCaptchaValidate: boolean = true;

  @ViewChild("recaptchaRef")
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
      // { type: 'minlength', message: 'Debes ingresar una contraseña entre 6 y 20 caracteres' },
      { type: 'maxlength', message: 'Debes ingresar una contraseña entre 6 y 20 caracteres'},
    ]
  }

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cookieService : CookieService ) {}

  ngOnInit() {
    this.validationLogin();
     this.validaInputs();
  }


  mostrarMensajeUsu(): boolean {
    // tslint:disable-next-line:max-line-length
    if (this.inputUsua.nativeElement.value === '' ) {
        return   true;
    } else {
      return  false;
    }
  }
  mostrarMensajePass(): boolean {
    // tslint:disable-next-line:max-line-length
    if (this.inputPass.nativeElement.value === '' ) {
      return true;
    } else {
      return false;
    }
  }

    validationLogin() {
    let rucStr = this.cookieService.check('ruc') ?
    this.cookieService.get('ruc') :  '';
    if (rucStr) {
      this.checked = true;
    }
    
    this.loginForm = this.formBuilder.group({
      ruc: [rucStr, Validators.compose([Validators.required,
            Validators.pattern('^[0-9]*$')])
           ],
      psw: ['', Validators.required ],
      rememberme: [false, Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  resolved(captchaResponse: string) : boolean{
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.isCaptchaValidate = true;
    return true;
  }


  validaInputs() {
    if(this.inputUsua.nativeElement.value !== null && this.inputPass.nativeElement.value !== null   ) {
      this.inputUsuaValid = false;
      this.inputPassValid = false; 
    } 
  }
  
  focusFunctionRuc(){ 
    this.inputUsuaValid = false;
  }
  focusFunctionPass(){
    this.inputPassValid = false; 
  } 
  
  /* /////// L O G I N ////////////  */

    

  public submitLogin() : any { 
    console.log("INTENTOS : "+this.intentos)

    if(this.inputUsua.nativeElement.value === '' && this.inputPass.nativeElement.value === '') {
      this.inputUsuaValid = true;
      this.inputPassValid = true;
      //return;
    }
    

    this.cookieService.delete('ruc');
    console.log("LOGIN VALID  : " +this.loginForm.valid);
    console.log(this.isCaptchaValidate);
    if(this.loginForm.valid && this.isCaptchaValidate){
      this.spinner.show();
      console.log(this.loginForm.value);
      this.loginService.login(this.f.ruc.value, this.f.psw.value)
      .pipe(first())
      .subscribe(
        value => {
          this.intentos= value.paramNum;
          this.intentosRestantes= 6 - this.intentos;
          this.codRespuesta= value.codRespuesta;
          if(value.paramStr==="Un session ya se encuentra activa"){
            Swal.fire({ type: 'warning', text: 'Existe una Sesión Activa'})
          }else if(this.intentos >= 6){
            this.codigo2= false;
            console.log("Intentos : " + value.paramNum + "   Sin codigo");
            Swal.fire({ type:"error", text: 'Contraseña Incorrecta” y texto: “Tu cuenta ha sido bloqueada por seguridad, inténtalo nuevamente en 60 minutos. Si tienes problemas para ingresar a tu cuenta, contáctanos a pilotos@intercorp.com.pe ', showConfirmButton: false, showCloseButton: true});
            this.intento6= true;
            this.isTrue = false;
                          
          }else if(value.estado===true && value.paramNum<=6){
                  if(this.rememberMe==true){
                      const expire = new Date();
                      expire.setDate(expire.getDate() + 25);
                      this.cookieService.set('ruc', this.f.ruc.value, expire);
                  }
                      this.router.navigate(['/home']);
                      this.spinner.hide();             
          }else if(this.intentos < 4 && this.codRespuesta == 2 ){
            console.log("Intentos : " + value.paramNum + "  Codigo de Respuesta 2");
            this.codigo2=true;
          }else if(this.intentos < 4 && this.codRespuesta == 3){
            this.codigo2= false;
          
            console.log("Intentos : " + value.paramNum + "  Codigo de Respuesta 3");
            Swal.fire({ type:"error", text: 'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentosRestantes+' intentos restantes', showConfirmButton: false, showCloseButton: true}); 
          }else if(this.intentos == 4 && this.codRespuesta == 2){
            console.log("Intentos : " + value.paramNum + "   Codigo de Respuesta 2");
            this.loginService.errores= value.codRespuesta;            
            this.isCaptchaValidate = false;
            this.recaptchaRef !== undefined ? this.recaptchaRef.reset() : null;
            this.isTrue = true;              
            this.codigo2=true;          

          }else if(this.intentos == 4 && this.codRespuesta == 3){
            this.codigo2= false;
            console.log("Intentos : " + value.paramNum + "   Codigo de Respuesta 3");
            Swal.fire({ type:"error", text: 'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentosRestantes+' intentos restantes', showConfirmButton: false, showCloseButton: true});this.isCaptchaValidate = false;
            this.recaptchaRef !== undefined ? this.recaptchaRef.reset() : null;
            this.isTrue = true;              
            
          }else if(this.intentos == 5 && this.codRespuesta == 2){
            console.log("Intentos : " + value.paramNum + "   Codigo de Respuesta 2");
            this.isTrue = true;      
            this.codigo2=true;          
        
          }else if(this.intentos == 5 && this.codRespuesta == 3){
            this.codigo2= false;
            console.log("Intentos : " + value.paramNum + "   Codigo de Respuesta 3");
            Swal.fire({ type:"error", text: 'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentosRestantes+' intentos restantes', showConfirmButton: false, showCloseButton: true});        
            this.recaptchaRef !== undefined ? this.recaptchaRef.reset() : null;
            this.isCaptchaValidate = false;
            this.isTrue = true; 
            this.codigo2= false;             
          }         
        },
      error =>{ 
        this.spinner.hide();
        if(error.status ===500){
          Swal.fire({ type: 'error', text: 'ERROR del Servidor'}) 
        }
      },
      () => this.spinner.hide()
    );
  }
}
 
}
