import { Component } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ LoginService]
})
export class AppComponent {
  title = 'EurekaAngularProy';

  constructor(private router: Router, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
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

      matIconRegistry.addSvgIcon(
        'eurc_calendar',
        domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/calendar.svg'),
        { viewBox: '0 0 24 24' });
      matIconRegistry.addSvgIcon(
        'eurc_trash',
        domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/trash.svg'),
        { viewBox: '0 0 20 20' });
      matIconRegistry.addSvgIcon(
        'eurc_minimize',
        domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/minimize.svg'),
        { viewBox: '0 0 24 24' });
      }

  public show(): boolean{
    if(this.router.url.includes('/login')){
      return true;
    }
    return false;
  }
}
