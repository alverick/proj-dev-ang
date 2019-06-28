import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showHead: boolean = null;

  constructor(private router: Router,
              private loginService: LoginService,
              private storageService: StorageService) { 
    router.events.forEach((event) =>{
      if(event instanceof NavigationStart){
        if(event['url'] == '/login'){
          this.showHead=false;
        }else{
          this.showHead = true;
        }
      }
    });
  }

  ngOnInit() {
    
  }

  public logout(): void{
    this.loginService.logout().subscribe(
        response => {if(response) {this.storageService.logout();}}
    );
  }


  

  
}
