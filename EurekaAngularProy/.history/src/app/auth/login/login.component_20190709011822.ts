import { Component, OnInit, HostListener } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public  loginForm: FormGroup;
  public  submitted: Boolean = false;
  public  error: {ruc: string, message: string} = null;
  public  respuestaHttp: number;
  isTrue: boolean = false;
  intentos: number = 0;
  inputElement: any;
  isCaptchaValidate: boolean = true;

  noCoincidePsw : string = 'No coincido la password con el ruc';
  coincide : boolean = false;

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

  

@HostListener('keydown', ['$event'])
onKeyDown(e: KeyboardEvent) {
  if (
    [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 || 
    (e.keyCode === 65 && e.ctrlKey === true) || 
    (e.keyCode === 67 && e.ctrlKey === true) || 
    (e.keyCode === 86 && e.ctrlKey === true) || 
    (e.keyCode === 88 && e.ctrlKey === true) || 
    (e.keyCode === 65 && e.metaKey === true) ||
    (e.keyCode === 67 && e.metaKey === true) || 
    (e.keyCode === 86 && e.metaKey === true) || 
    (e.keyCode === 88 && e.metaKey === true) || 
    (e.keyCode >= 35 && e.keyCode <= 39) 
  ) {
    return;  
  }
  // Ensure that it is a number and stop the keypress
  if (
    (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
    (e.keyCode < 96 || e.keyCode > 105)
  ) {
    e.preventDefault();
  }
}

@HostListener('paste', ['$event'])
onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const pastedInput: string = event.clipboardData
    .getData('text/plain')
    .replace(/\D/g, ''); // get a digit-only string
  document.execCommand('insertText', false, pastedInput);
}
@HostListener('drop', ['$event'])
onDrop(event: DragEvent) {
  event.preventDefault();
  const textData = event.dataTransfer
    .getData('text').replace(/\D/g, '');
  this.inputElement.focus();
  document.execCommand('insertText', false, textData);
}
  constructor(
    private formBuilder: FormBuilder,
    private LoginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      ruc: ['', Validators.compose([Validators.minLength(11), Validators.required,
            Validators.pattern("^[0-9]*$")])],
      psw: ['', Validators.required ]
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
                console.log("no coincide  :  "+ this.noCoincidePsw);

                if(value.paramStr !== 'No coincido la password con el ruc'){
                this.loginForm = this.formBuilder.group({
                  ruc: [''],
                  psw: ['']
                });
                this.spinner.hide();
                console.log("Variable ParamNum  :  " +value.paramNum +" intentos"+ this.intentos);
                return this.coincide= true;

                return this.isTrue = false;
                }else{
                  return this.coincide= true;
                }         
              }




              else 
              if(this.intentos == 4 || this.intentos == 5 ){
                console.log("ParamStr  :  "+ value.paramStr);
                if(this.noCoincidePsw != value.paramStr){
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
                return this.isTrue = true;
                }else{
                  return this.coincide=true;
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
                alert("No registrado");
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

/*
[CA8] Si la contraseña es incorrecta, se deberá mostrar un pop-up con título “Contraseña incorrecta” y texto “Lo
sentimos tu contraseña es incorrecta, verifícala o vuelve a intentarlo. Tienes X intentos restantes”.

*/
