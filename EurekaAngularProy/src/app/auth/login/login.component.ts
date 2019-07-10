import { Component, OnInit, HostListener, Directive} from '@angular/core';
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

  isTrue: boolean = false;
  intentos: number = 0;
  isCaptchaValidate: boolean = true;
  

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
    private LoginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cookieService : CookieService   ) {}

  ngOnInit() {
    let rucStr = this.cookieService.check('ruc') ?
    this.cookieService.get('ruc') :  '';
    this.loginForm = this.formBuilder.group({
      ruc: [rucStr, Validators.compose([Validators.minLength(11), Validators.required,
            Validators.pattern("^[0-9]*$")])],
      psw: ['', Validators.required ],
      rememberme:[false]  
     
    });
  }

  get f() { return this.loginForm.controls; }
  
  resolved(captchaResponse: string) : boolean{
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.isCaptchaValidate = true;
    return true;
  }
   
  savedata(){
    console.log(this.loginForm.value)
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

  public submitLogin(): any {
    this.submitted = true;
    this.error = null;
    console.log("LOGIN VALID  : " +this.loginForm.valid);
    if(this.loginForm.valid && this.isCaptchaValidate){
      this.spinner.show();
      console.log(this.loginForm.value);
      
      this.LoginService.login(this.f.ruc.value, this.f.psw.value)
      .pipe(first())
      .subscribe(
          value => {
            this.intentos= value.paramNum;
            if(value.estado===true){
            this.router.navigate(['/home']);
            this.spinner.hide();          
            }
            else
              if(this.intentos <= 3){
                console.log("ParamStr  :  "+ value.paramStr);
                if(value.codRespuesta == 2){
                this.loginForm = this.formBuilder.group({
                  ruc: [''],
                  psw: ['']
                });
                this.spinner.hide();
                console.log("Variable ParamNum  :  " +value.paramNum +" intentos"+ this.intentos);
                return this.codRpt2= true;
                }
                else 
                if(value.codRespuesta == 3){
                this.loginForm = this.formBuilder.group({
                  ruc: [''],
                  psw: ['']
                });
                this.spinner.hide();
                console.log("Variable ParamNum  :  " +value.paramNum +" intentos"+ this.intentos);
                Swal.fire({
                  type: 'error',
                  text: 'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentos+' intentos',
                }) 
                }                
                else{
                  this.loginForm = this.formBuilder.group({
                    ruc: [''],
                    psw: ['']
                  });
                  console.log("Variable ParamNum  :  " +value.paramNum +" intentos"+ this.intentos);
                  return this.isTrue=false;
                }         
              }




              else 
              if(this.intentos == 4 || this.intentos == 5 ){
                console.log("ParamStr  :  "+ value.paramStr);
                if(value.codRespuesta == 2){
                  this.loginForm = this.formBuilder.group({
                    ruc: [''],
                    psw: ['']
                  });
                  this.spinner.hide();
                  console.log("Variable ParamNum  :  " +value.paramNum +" intentos"+ this.intentos);
                  return this.codRpt2= true;
                }
                else 
                if(value.codRespuesta == 3){
                this.loginForm = this.formBuilder.group({
                  ruc: [''],
                  psw: ['']
                });
                this.spinner.hide();
                console.log("Variable ParamNum  :  " +value.paramNum +" intentos"+ this.intentos);
                
                Swal.fire({
                  type: 'error',
                  text: 'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentos+' intentos',
                }) 
                }     

                else{
                  this.loginForm = this.formBuilder.group({
                    ruc: [''],
                    psw: ['']
                  });
                  this.spinner.hide();
                  console.log("Variable ParamNum  :  " +value.paramNum +" intentos"+ this.intentos);
                  Swal.fire({
                    type: 'error',
                    text: 'Lo sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes  '+this.intentos+' intentos',
                  })
                  this.isCaptchaValidate = false;
                  return this.isTrue = true;              
                }
              }
              

              else
              if(this.intentos = 6){
                this.loginForm = this.formBuilder.group({
                  ruc: [''],
                  psw: ['']
                });
                Swal.fire({
                  type: 'error',
                  title: 'Contraseña Incorrecta',
                  text: 'Tu cuenta ha sido bloqueada por seguridad, inténtalo nuevamente en 60 minutos. Si tienes problemas para ingresar a tu cuenta, contáctanos a pilotos@intercorp.com.pe',
                })
                this.spinner.hide();
                console.log("Variable ParamNum  :  " +value.paramNum +" intentos"+ this.intentos);
              }
          },
          error =>{
            this.error=error;
            this.spinner.hide();
            console.log("error")
          }
      )
    }
  }


}
