import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { isNil } from 'ramda';
import { LoginService } from 'src/app/shared/services/login.service';

import { appFullRoutingNames } from './app-routing.names';
import { primeng } from './shared/lang/es';
import { AdobeAnalyticsService } from './shared/services/adobe-analytics.service';

@Component({
  selector: 'cs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [LoginService],
})
export class AppComponent implements OnInit, AfterContentChecked {
  title = 'Cobro Simple – Interbank';
  showButton = false;
  expand = false;

  constructor(
    private router: Router,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private primengConfig: PrimeNGConfig,
    private adobeAnalytics: AdobeAnalyticsService
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.showButton = !val.url.startsWith(appFullRoutingNames.ADMIN);
        adobeAnalytics.pageTrack(val.urlAfterRedirects);
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
    void this.adobeAnalytics.injectAdobeLaunchScript();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation(primeng);
  }
  ngAfterContentChecked() {
    this.expand = isNil(document.querySelector('cs-layout-form'));
  }
}
