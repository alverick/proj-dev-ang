import { type AnimationEvent } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSpinnerModule } from 'ngx-spinner';
import { isNil, isNotEmpty } from 'ramda';
import { filter, Subject, takeUntil } from 'rxjs';

import { environment } from '../environments/environment';
import { appFullRoutingNames } from './app-routing.names';
import {
  fadeAnimation,
  phasesStateName,
} from './shared/animations/page-transitions';
import { FabWhatsappComponent } from './shared/components/fab-whatsapp/fab-whatsapp.component';
import { ValidationDefaultsComponent } from './shared/components/validation-defaults/validation-defaults.component';
import { AdobeLaunchProviderService } from './shared/services';
import { DynatraceProviderService } from './shared/services/dynatrace-provider.service';
import { HotjarProviderService } from './shared/services/hotjar-provider.service';
import { AppConfigActions } from './store/actions/app-config.actions';

@Component({
  selector: 'cs-root',
  templateUrl: './app.component.html',
  animations: [fadeAnimation],
  imports: [
    RouterModule,
    NgxSpinnerModule,
    FabWhatsappComponent,
    ValidationDefaultsComponent,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  title = 'Cobro Simple – Interbank';
  showButton = signal(false);
  expand = signal(false);
  appLoaded = signal(false);
  spinnerBackground = signal('rgba(255, 255, 255, 1)');

  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly adobeLaunch = inject(AdobeLaunchProviderService);
  private readonly hotjar = inject(HotjarProviderService);
  private readonly _dynatrace = inject(DynatraceProviderService);

  constructor() {
    this.adobeLaunch.startTracking();
    this.hotjar.startTracking();
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event: NavigationEnd) => {
        this.showButton.set(!event.url.startsWith(appFullRoutingNames.ADMIN));
        this.detectLayoutForm();
      });

    document.addEventListener('at-content-rendering-succeeded', () => {
      this.spinnerBackground.set('rgba(0, 0, 0, 0.7)');
    });

    document.addEventListener('at-content-rendering-failed', () => {
      this.spinnerBackground.set('rgba(0, 0, 0, 0.7)');
    });
  }

  onAnimationEvent(event: AnimationEvent) {
    if (
      event.phaseName === phasesStateName.start &&
      !this.appLoaded() &&
      isNotEmpty(environment.adobe)
    ) {
      this.store.dispatch(AppConfigActions.setLoader({ show: true }));
    }
    if (event.phaseName === phasesStateName.done) {
      this.appLoaded.set(true);
      document.querySelector('.overlay-app')?.classList.add('showed');
    }
  }

  private detectLayoutForm() {
    setTimeout(() => {
      this.expand.set(isNil(document.querySelector('cs-layout-form')));
    }, 300);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
