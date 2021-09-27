import { NavigationEnd, Router } from '@angular/router';

import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleAnalytics } from './shared/services/googleAnalytics.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { MatIconRegistry } from '@angular/material';
import { environment } from 'src/environments/environment';

declare let gtag: Function;
declare let fbq:Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ LoginService]
})
export class AppComponent {
  title = 'Cobro Simple – Interbank';

  constructor(private router: Router, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer,private gaService: GoogleAnalytics) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (environment.production) {

          this.gaService.sendUrl(e.urlAfterRedirects.substr(1),e.urlAfterRedirects);

          /*
          gtag('config', 'UA-148142629-1', {
            'page_title': e.urlAfterRedirects.substr(1),
            'page_path': e.urlAfterRedirects
          });
          */
          //Pixel Facebook
          this.sendTrackPageViewPixel(e.urlAfterRedirects);

        }

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
        'eurc_download',
        domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/download.svg'),
        { viewBox: '0 0 20 20' });
      matIconRegistry.addSvgIcon(
        'eurc_minimize',
        domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/minimize.svg'),
        { viewBox: '0 0 24 24' });
      matIconRegistry.addSvgIcon(
        'eurc_new_tab',
        domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/new-tab.svg'),
        { viewBox: '0 0 24 24' });
  }

  public show(): boolean{
    if(this.router.url.includes('/login')){
      return true;
    }
    return false;
  }

  private sendTrackPageViewPixel(pathComponent: string): void{
    var path: string = pathComponent;

    switch ( path ) {
      case '/landing':
        fbq('track', 'PageView');
        break;
      case '/identifiquemosEmpresa':
        fbq('track', 'PageView');
        break;
      case '/completaDatosEmpresa':
        fbq('track', 'PageView');
        break;
      case '/completadoPrimeraParte':
        fbq('track', 'PageView');
        break;
      case '/configuraCobrosParteUnoAfiliacion':
        fbq('track', 'PageView');
        break;
      case '/configuraCobrosParteDosAfiliacion':
        fbq('track', 'PageView');
        break;
      case '/configuraCobrosParteTresAfiliacion':
        fbq('track', 'PageView');
        break;
      case '/configuraCobrosParteCuatroAfiliacion':
        fbq('track', 'PageView');
        break;
      case '/resumenCobrosAfiliacion':
        fbq('track', 'PageView');
        break;
      case '/procesando':
        fbq('track', 'Contact', {
          content_name: 'cobro-simple-5'
        });
        break;
      /*default:
        fbq('track', 'PageView');
        break;*/
   }
  }
}
