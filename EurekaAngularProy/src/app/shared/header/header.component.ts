import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showHead: boolean = null;

  constructor(private router: Router,
              private loginService: LoginService,
              private spinner: NgxSpinnerService) { 
  }

  ngOnInit() {
    
  }

  public logout(): void{
    this.spinner.show();
    this.loginService.logout();
  }

  public show(): boolean{
    if(this.router.url.includes('/login') || this.router.url.includes('/afiliacion')|| this.router.url.includes('/crearContrasena')){
      return false;
    }
    return true;
  }

}
