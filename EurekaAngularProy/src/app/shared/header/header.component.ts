import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showHead: boolean = null;

  constructor(private router: Router,
              private loginService: LoginService) { 
  }

  ngOnInit() {
    
  }

  public logout(): void{
    this.loginService.logout();
  }

  public show(): boolean{
    if(this.router.url.includes('/login') || this.router.url.includes('/afiliacion')|| this.router.url.includes('/crearContrasena')){
      return false;
    }
    return true;
  }

}
