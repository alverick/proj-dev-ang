import { Component, OnInit, HostListener, Directive, ElementRef, Input} from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

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



private specialKeys = {
  number: [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight' ],
  decimal: [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight' ],
};
  intentos: number = 0;
  codRespuesta: number;
  err: boolean;
  numero2: number;
  
  isTrue: boolean = false;
  isCaptchaValidate: boolean = true;
  rememberMe: boolean = false;

  codRpt2 : boolean = false;
  codRpt3 : boolean = false;
  

  account_validation_messages = {
    'ruc': [
      { type: 'required', message: 'Debes ingresar un RUC' },
      { type: 'minlength', message: 'Ingrese un RUC válido de 11 dígitos' },
      { type: 'pattern', message: 'Debe contener solo números' },     
    ],
    'psw': [
      { type: 'required', message:  'Debe ingresar el password' },
      { type: 'minlength', message: 'Debes ingresar una contraseña entre 6 y 20 caracteres' },
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
    this.codRpt2;
  }

  validationLogin(){
   /* let rucStr = this.cookieService.check('ruc') ?
    this.cookieService.get('ruc') :  '';*/
    let rucStr = this.cookieService.check('ruc') ?
    this.cookieService.get('ruc') :  '';
    
    this.loginForm = this.formBuilder.group({
      ruc: [rucStr, Validators.compose([Validators.minLength(11), Validators.required,
            Validators.pattern('^[0-9]*$')])
          ],
      psw: ['', Validators.required ],
      rememberme:[false, Validators.required]  
    });
  }

  get f() { return this.loginForm.controls; }
  
  resolved(captchaResponse: string) : boolean{
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.isCaptchaValidate = true;
    return true;
  }
   

  

  /* ////////  N O T  - A L L L O W - T O - C O P Y //////// */
  
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
  

  /* /////// L O G I N ////////////  */

  public submitLogin() : any {
    this.submitted = true;
    this.error = null;
    console.log("LOGIN VALID  : " +this.loginForm.valid);
    if(this.loginForm.valid && this.isCaptchaValidate){
      this.spinner.show();
      console.log(this.loginForm.value);
      this.loginService.login(this.f.ruc.value, this.f.psw.value)
      .pipe(first())
      .subscribe(
        value => {
          this.intentos= value.paramNum;
          this.codRespuesta= value.codRespuesta;
          console.log("Codigo de respuseta : "+this.codRespuesta);
          if(value.estado===true){
            let rucStr = this.cookieService.check('ruc')
            if(this.rememberMe==true){
              let rucStr = this.cookieService.check('ruc') ?
              this.cookieService.get('ruc') :  '';
              this.router.navigate(['/home']);
              this.spinner.hide();   
            }else{
              this.router.navigate(['/home']);
              this.spinner.hide();
            }
            /* let rucStr = this.cookieService.check('ruc') ?
              this.cookieService.get('ruc') :  '';*/
            
          }else if(this.intentos <= 3 && this.codRespuesta == 2 ){
            console.log("Intentos : " + value.paramNum + "  Codigo de Respuesta 2");
            this.loginService.errores= value.codRespuesta;
          }else if(this.intentos <= 3 && this.codRespuesta == 3){
            console.log("Intentos : " + value.paramNum + "  Codigo de Respuesta 3");
            Swal.fire({ type: 'error', text: 'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentos+' intentos'})        
          }else if(this.intentos == 4 && this.codRespuesta == 2){
            console.log("Intentos : " + value.paramNum + "   Codigo de Respuesta 2");
            this.loginService.errores= value.codRespuesta;            
            this.isCaptchaValidate = false;
          }else if(this.intentos == 4 && this.codRespuesta == 3){
            console.log("Intentos : " + value.paramNum + "   Codigo de Respuesta 3");
            Swal.fire({ type: 'error', text: 'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentos+' intentos'})        
            this.isCaptchaValidate = false;
            return this.isTrue = true;              
          }else if(this.intentos == 5 && this.codRespuesta == 2){
            console.log("Intentos : " + value.paramNum + "   Codigo de Respuesta 2");
          }else if(this.intentos == 5 && this.codRespuesta == 3){
            console.log("Intentos : " + value.paramNum + "   Codigo de Respuesta 3");
            Swal.fire({ type: 'error', text: 'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentos+' intentos'})        
            this.isCaptchaValidate = false;
          }else if(this.intentos == 6){
            console.log("Intentos : " + value.paramNum + "   Sin codigo");
            Swal.fire({ type: 'error', title: 'Contraseña Incorrecta', text: 'Tu cuenta ha sido bloqueada por seguridad, inténtalo nuevamente en 60 minutos. Si tienes problemas para ingresar a tu cuenta, contáctanos a pilotos@intercorp.com.pe'})
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
