import { Component } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { StorageService } from './shared/services/storage.service';
import { Router, NavigationEnd } from '@angular/router';

declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ LoginService]
})
export class AppComponent {
  title = 'EurekaAngularProy';

  constructor(private router: Router,
    private loginService: LoginService,
    private storageService: StorageService) {

      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          ga('set', 'page', e.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });
  }

  public show(): boolean{
    if(this.router.url.includes('/login')){
      return true;
    }
    return false;
  }
}
