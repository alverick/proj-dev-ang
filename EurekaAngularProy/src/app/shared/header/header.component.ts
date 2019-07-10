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
  }

  ngOnInit() {
    
  }

  public logout(): void{
    this.storageService.logout();
  }

}
