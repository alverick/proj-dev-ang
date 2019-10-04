import { Component } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { StorageService } from './shared/services/storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleAnalytics } from './shared/services/googleAnalytics.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ LoginService]
})
export class AppComponent {
  title = 'EurekaAngularProy';

  constructor(private router: Router, gaService: GoogleAnalytics) {
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          console.log('va a google', e.urlAfterRedirects);
          gtag('config', 'UA-148142629-1', {
            'page_title': e.urlAfterRedirects.substr(1),
            'page_path': e.urlAfterRedirects
          });
          window.scrollTo(0, 0);
          //gaService.sendEvent('screen_view', { 'app_name': 'Eureca', 'screen_name': e.urlAfterRedirects.substr(1) });
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
