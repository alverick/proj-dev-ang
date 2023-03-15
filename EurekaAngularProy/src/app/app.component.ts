import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { environment } from 'src/environments/environment';

import { appFullRoutingNames } from './app-routing.names';
import {
  authFullRoutingChildNames,
  authFullRoutingNames,
} from './features/auth/auth-routing.names';
import { primeng } from './shared/lang/es';
import { GoogleAnalytics } from './shared/services/googleAnalytics.service';

declare let fbq: (...args: any[]) => void;
@Component({
  selector: 'cs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService],
})
export class AppComponent implements OnInit {
  title = 'Cobro Simple – Interbank';

  constructor(
    private router: Router,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private gaService: GoogleAnalytics,
    private config: PrimeNGConfig
  ) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (environment.production) {
          this.gaService.sendUrl(
            e.urlAfterRedirects.substr(1),
            e.urlAfterRedirects
          );

          /*
          gtag('config', 'UA-148142629-1', {
            'page_title': e.urlAfterRedirects.substr(1),
            'page_path': e.urlAfterRedirects
          });
          */
          // Pixel Facebook
          this.sendTrackPageViewPixel(e.urlAfterRedirects);
        }
        // gaService.sendEvent('screen_view', { 'app_name': 'Eureca', 'screen_name': e.urlAfterRedirects.substr(1) });
      }
    });

    matIconRegistry.addSvgIcon(
      'eurc_calendar',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/images/calendar.svg'
      ),
      { viewBox: '0 0 24 24' }
    );
    matIconRegistry.addSvgIcon(
      'eurc_trash',
      domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/trash.svg'),
      { viewBox: '0 0 20 20' }
    );
    matIconRegistry.addSvgIcon(
      'eurc_download',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/images/download.svg'
      ),
      { viewBox: '0 0 20 20' }
    );
    matIconRegistry.addSvgIcon(
      'eurc_minimize',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/images/minimize.svg'
      ),
      { viewBox: '0 0 24 24' }
    );
    matIconRegistry.addSvgIcon(
      'eurc_new_tab',
      domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/new-tab.svg'),
      { viewBox: '0 0 24 24' }
    );
  }

  ngOnInit() {
    this.config.setTranslation(primeng);
  }

  private sendTrackPageViewPixel(pathComponent: string): void {
    switch (pathComponent) {
      case appFullRoutingNames.LANDING:
        fbq('track', 'PageView');
        break;
      case authFullRoutingNames.COMPANY_REGISTER:
        fbq('track', 'PageView');
        break;
      case authFullRoutingNames.COMPANY_FILL_DATA:
        fbq('track', 'PageView');
        break;
      case authFullRoutingNames.COMPANY_FINISHED:
        fbq('track', 'PageView');
        break;
      case authFullRoutingChildNames.SERVICES_ADD_INFO:
        fbq('track', 'PageView');
        break;
      case authFullRoutingChildNames.SERVICES_ADD_CONFIGURATION:
        fbq('track', 'PageView');
        break;
      case authFullRoutingChildNames.SERVICES_ADD_LIST:
        fbq('track', 'PageView');
        break;
      case authFullRoutingNames.REGISTRATION_FINISHED:
        fbq('track', 'Contact', {
          content_name: 'cobro-simple-5',
        });
        break;
      /*default:
        fbq('track', 'PageView');
        break;*/
    }
  }
}
