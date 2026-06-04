import { type AnimationEvent } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSpinnerModule } from 'ngx-spinner';
import { isNil, isNotEmpty } from 'ramda';
import { filter, Subject, takeUntil } from 'rxjs';

import { environment } from '../environments/environment';
import { appFullRoutingNames } from './app-routing.names';
import { authFullRoutingNames } from './features/auth/auth-routing.names';
import {
  fadeAnimation,
  phasesStateName,
} from './shared/animations/page-transitions';
import { FabWhatsappComponent } from './shared/components/fab-whatsapp/fab-whatsapp.component';
import { ValidationDefaultsComponent } from './shared/components/validation-defaults/validation-defaults.component';
import { RespuestaLogin } from './shared/models/respuestaLogin.model';
import { AdobeLaunchProviderService } from './shared/services';
import { DynatraceProviderService } from './shared/services/dynatrace-provider.service';
import { HotjarProviderService } from './shared/services/hotjar-provider.service';
import { LoginService } from './shared/services/login.service';
import { SessionService } from './shared/services/session.service';
import { StorageService } from './shared/services/storage.service';
import { swalAlert } from './shared/utils/helpers/popups';
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
  private readonly sessionService = inject(SessionService);
  private readonly storageService = inject(StorageService);
  private readonly loginService = inject(LoginService);

  constructor() {
    this.adobeLaunch.startTracking();
    this.hotjar.startTracking();
  }

  ngOnInit() {
    this.initializeSessionSubscriptions();
    this.handlePageRecoveryOrReload();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.showButton.set(!event.url.startsWith(appFullRoutingNames.ADMIN));
        this.detectLayoutForm();

        if (event.url.startsWith(authFullRoutingNames.LOGIN)) {
          this.sessionService.stopTracking();
        }
      });

    document.addEventListener('at-content-rendering-succeeded', () => {
      this.spinnerBackground.set('rgba(0, 0, 0, 0.7)');
    });

    document.addEventListener('at-content-rendering-failed', () => {
      this.spinnerBackground.set('rgba(0, 0, 0, 0.7)');
    });
  }

  private initializeSessionSubscriptions(): void {
    this.sessionService.sessionWarning$
      .pipe(takeUntil(this.destroy$))
      .subscribe((secondsLeft: number) => {
        this.showOrUpdateWarningModal(secondsLeft);
      });

    this.sessionService.requestBackendTokenRefresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loginService.refresh().subscribe({
          next: (res: RespuestaLogin) => {
            this.sessionService.scheduleNextBackgroundRefresh(res.exp);
          },
          error: () => {
            this.executeImmediateLogout('server-error');
          },
        });
      });

    this.sessionService.sessionTimedOut$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeWarningModal();
        this.executeImmediateLogout('expired');
      });
  }

  private handlePageRecoveryOrReload(): void {
    const session = this.storageService.getCurrentSession();

    if (session?.token && session?.expire) {
      this.sessionService.startTracking(session.expire);
    }
  }

  private showOrUpdateWarningModal(secondsLeft: number): void {
    if (swalAlert.isVisible()) {
      swalAlert.update({
        html: `Para garantizar tu seguridad, la sesión se cerrará en <br/> <span class="tw-text-xl tw-font-semibold">${secondsLeft}  seg</span>`,
      });
      return;
    }

    void swalAlert
      .fire({
        title: '¿Sigues ahí?',
        html: `Para garantizar tu seguridad, la sesión se cerrará en <br/> <span class="tw-text-xl tw-font-semibold">${secondsLeft}  seg</span>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Seguir aquí',
        cancelButtonText: 'Cerrar sesión',
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          container: 'cs-alert',
          popup: 'tw-max-w-3xl',
          actions:
            'tw-flex tw-flex-row-reverse tw-flex-nowrap tw-justify-center tw-gap-4',
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.sessionService.rescueUiSession();
        } else if (result.isDismissed) {
          this.executeVoluntaryLogout();
        }
      });
  }

  private closeWarningModal(): void {
    if (swalAlert.isVisible()) {
      swalAlert.close();
    }
  }

  private executeImmediateLogout(reason: 'expired' | 'server-error'): void {
    this.loginService.logout().subscribe(() => {
      this.storageService.removeCurrentSession();

      void this.router.navigate([authFullRoutingNames.LOGIN], {
        queryParams: { reason: reason },
        replaceUrl: true,
      });
    });
  }

  private executeVoluntaryLogout(): void {
    this.storageService.removeCurrentSession();

    void this.router.navigateByUrl(authFullRoutingNames.LOGIN);
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
    this.sessionService.destroyService();
  }
}
