import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatInputModule } from '@angular/material/input';

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

  constructor(
    private formBuilder: FormBuilder,
    private LoginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService
    ) { 
      this.loginForm = this.formBuilder.group({
        ruc: ['', Validators.required ],
        psw: ['', Validators.required ]
      });
    }

  ngOnInit() {
    
  }

  get f() { return this.loginForm.controls; }


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
            }else{
              this.loginForm = this.formBuilder.group({
                ruc: [''],
                psw: ['']
              });
              this.spinner.hide();
            }
          },
          error =>{
            this.error=error;
            this.spinner.hide();

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
