import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { type ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Lara from '@primeuix/themes/lara';
import { LoggerModule } from 'ngx-logger';
import { ValdemortModule } from 'ngx-valdemort';
import { providePrimeNG } from 'primeng/config';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { AuthGuard } from './shared/guards/auth.guard';
import { GtpInputGuard } from './shared/guards/gtp-input.guard';
import { GtpOutputGuard } from './shared/guards/gtp-output.guard';
import { LogoutGuard } from './shared/guards/logout.guard';
import { AuthInterceptorService } from './shared/interceptors/auth-interceptor.service';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import { primeng } from './shared/lang/es';
import { AdobeLaunchProviderService, CompanyService } from './shared/services';
import { DynatraceProviderService } from './shared/services/dynatrace-provider.service';
import { EncryptionService } from './shared/services/encryption.service';
import { ExcelService } from './shared/services/excel.service';
import { HotjarProviderService } from './shared/services/hotjar-provider.service';
import { NotifyService } from './shared/services/notify.service';
import { StorageService } from './shared/services/storage.service';
import { AppConfigEffects } from './store/effects/app-config.effects';
import { entityStoreConfig } from './store/entity-store.config';
import { appConfigFeature } from './store/reducers/app-config.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order:
              'tailwind-base, primeng, custom, general, tailwind-utilities',
          },
        },
      },
      ripple: true,
      translation: primeng,
    }),
    provideStore(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
        },
      },
    ),
    provideState(appConfigFeature),
    provideEffects([AppConfigEffects]),
    ...entityStoreConfig,
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      connectInZone: true,
    }),
    importProvidersFrom(
      BrowserModule,
      LoggerModule.forRoot({
        level: environment.logLevel,
        serverLogLevel: environment.serverLogLevel,
        disableConsoleLogging: false,
        enableSourceMaps: true,
      }),
      ValdemortModule,
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    EncryptionService,
    AdobeLaunchProviderService,
    HotjarProviderService,
    NotifyService,
    DynatraceProviderService,
    StorageService,
    CompanyService,
    LogoutGuard,
    ExcelService,
    AuthGuard,
    GtpOutputGuard,
    GtpInputGuard,
  ],
};
