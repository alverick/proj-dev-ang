import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
  public  respuestaHttp: number

  account_validation_messages = {
    'ruc': [
      { type: 'required', message: 'Debes ingresar un RUC' },
      { type: 'minlength', message: 'Ingrese un RUC válido de 11 dígitos' },
      { type: 'pattern', message: 'Debe contener solo números' },
      { type: 'validUsername', message: 'Your username has already been taken' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ]
  
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

  savedata(){
    console.log(this.loginForm.value)
  }

  public submitLogin(): void {
    this.submitted = true;
    this.error = null;

    console.log("LOGIN VALID  : " +this.loginForm.valid);
    if(this.loginForm.valid){
      this.spinner.show();
      console.log(this.loginForm.value);
      this.LoginService.login(this.f.ruc.value, this.f.psw.value)
      .pipe(first())
      .subscribe(
          value => {
            if(value.estado===true){
            this.router.navigate(['/home']);
            this.spinner.hide();
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1500
            })
            }else{
              this.loginForm = this.formBuilder.group({
                ruc: [''],
                psw: ['']
              });
              this.spinner.hide();
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


  


/*  public submitLogin(): void {
    this.submitted = true;
    this.error = null;
    console.log(this.loginForm.value);
    if(this.loginForm.valid){
      console.log(this.loginForm.valid); 
      console.log(this.LoginService.login(new LoginObject(this.loginForm.value)));
      console.log(data => this.correctLogin(data));    
      this.LoginService.login(new LoginObject(this.loginForm.value)).subscribe(       
        data => this.correctLogin(data),
        error => {
          this.error = error;
        })
    }
  }*/
/*
  private correctLogin(data: Session){
    this.storageService.setCurrentSession(data);
    this.router.navigate(['/home']);
  } */
}
