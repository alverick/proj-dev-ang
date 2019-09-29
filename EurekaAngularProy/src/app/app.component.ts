import { Component } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { StorageService } from './shared/services/storage.service';
import { Router, NavigationEnd } from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ LoginService]
})
export class AppComponent {
  title = 'EurekaAngularProy';

  constructor(private router: Router) {
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          gtag('event', 'page_view');
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
