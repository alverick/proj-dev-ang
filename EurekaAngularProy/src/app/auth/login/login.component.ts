import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Session } from "src/app/shared/models/session.model";
import { LoginObject } from 'src/app/shared/services/login-object.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public submitted: Boolean = false;
  public error: {ruc: string, message: string} = null;

  constructor(
    private formBuilder: FormBuilder,
    private LoginService: LoginService,
    private storageService: StorageService,
    private router: Router    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      ruc: ['', Validators.required],
      psw: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }


  public submitLogin(): void {
    this.submitted = true;
    this.error = null;
    console.log("LOGIN VALID  : " +this.loginForm.valid);
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      this.LoginService.login(this.f.ruc.value, this.f.psw.value)
      .pipe(first())
      .subscribe(
          ()=>{
            this.router.navigate(['/home']);
          },
          error =>{
            this.error=error;
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

  private correctLogin(data: Session){
    console.log(data);
    this.storageService.setCurrentSession(data);
    this.router.navigate(['/home']);
  } 
}
