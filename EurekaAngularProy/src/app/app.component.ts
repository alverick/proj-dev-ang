import { type AnimationEvent } from '@angular/animations';
import { Component, type OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import { isNil, isNotEmpty } from 'ramda';
import { delay } from 'rxjs';

import { environment } from '../environments/environment';
import { appFullRoutingNames } from './app-routing.names';
import {
  fadeAnimation,
  phasesStateName,
} from './shared/animations/page-transitions';
import { primeng } from './shared/lang/es';
import {
  AdobeLaunchProviderService,
  NewRelicProviderService,
} from './shared/services';
import { LoginService } from './shared/services/login.service';
import { AppConfigActions } from './store/actions/app-config.actions';

@Component({
  selector: 'cs-root',
  templateUrl: './app.component.html',
  providers: [LoginService],
  animations: [fadeAnimation],
})
export class AppComponent implements OnInit {
  title = 'Cobro Simple – Interbank';
  showButton = false;
  expand = false;
  appLoaded = false;
  spinnerBackground = 'rgba(255, 255, 255, 1)';

  constructor(
    private primengConfig: PrimeNGConfig,
    adobeLaunch: AdobeLaunchProviderService,
    newrelic: NewRelicProviderService,
    private router: Router,
    private store: Store,
  ) {
    adobeLaunch.startTracking();
    newrelic.startTracking();

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.showButton = !val.url.startsWith(appFullRoutingNames.ADMIN);
      }
    });

    this.detectLayoutForm();
  }

  onAnimationEvent(event: AnimationEvent) {
    if (
      event.phaseName === phasesStateName.start &&
      !this.appLoaded &&
      isNotEmpty(environment.adobe)
    ) {
      this.store.dispatch(AppConfigActions.setLoader({ show: true }));
    }
    if (event.phaseName === phasesStateName.done) {
      this.appLoaded = true;
      setTimeout(() => {
        const overlay = document.querySelector('.overlay-app');
        overlay?.classList.add('showed');
      }, 200);
    }
  }

  detectLayoutForm() {
    this.router.events.pipe(delay(300)).subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.expand = isNil(document.querySelector('cs-layout-form'));
      }
    });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation(primeng);
    document.addEventListener('at-content-rendering-succeeded', () => {
      setTimeout(() => {
        this.spinnerBackground = 'rgba(0, 0, 0, 0.7)';
      }, 500);
    });

    document.addEventListener('at-content-rendering-failed', () => {
      setTimeout(() => {
        this.spinnerBackground = 'rgba(0, 0, 0, 0.7)';
      }, 500);
    });
  }
}
