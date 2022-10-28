import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { environment } from 'src/environments/environment';
import { appFullRoutingNames } from './app-routing.names';
import { authFullRoutingNames } from './features/auth/auth-routing.names';
import { internalAuthFullRoutingNames } from './features/internal/internal-routing.names';
import { GoogleAnalytics } from './shared/services/googleAnalytics.service';

declare let fbq: (...args: any[]) => void;
@Component({
  selector: 'cs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService],
})
export class AppComponent {
  title = 'Cobro Simple – Interbank';

  constructor(
    private router: Router,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private gaService: GoogleAnalytics
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

  private sendTrackPageViewPixel(pathComponent: string): void {
    const path: string = pathComponent;

    const { CHARGES_AFFILIATION } = internalAuthFullRoutingNames;

    const {
      CHARGES_AFFILIATION_ADD_STEP_4,
      CHARGES_AFFILIATION_ADD_STEP_3,
      CHARGES_AFFILIATION_ADD_STEP_2,
      CHARGES_AFFILIATION_ADD_STEP_1,
    } = internalAuthFullRoutingNames;
    switch (path) {
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
      case CHARGES_AFFILIATION_ADD_STEP_1:
        fbq('track', 'PageView');
        break;
      case CHARGES_AFFILIATION_ADD_STEP_2:
        fbq('track', 'PageView');
        break;
      case CHARGES_AFFILIATION_ADD_STEP_3:
        fbq('track', 'PageView');
        break;
      case CHARGES_AFFILIATION_ADD_STEP_4:
        fbq('track', 'PageView');
        break;
      case CHARGES_AFFILIATION:
        fbq('track', 'PageView');
        break;
      case authFullRoutingNames.PROCESSING:
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
