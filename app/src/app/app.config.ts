import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserModule } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { LoggerModule } from 'ngx-logger';
import { ValdemortModule } from 'ngx-valdemort';
import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { AppConfigEffects } from './store/effects/app-config.effects';
import { appConfigFeature } from './store/reducers/app-config.reducer';
import { AuthInterceptorService } from './shared/interceptors/auth-interceptor.service';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import { AdobeLaunchProviderService, CompanyService } from './shared/services';
import { EncryptionService } from './shared/services/encryption.service';
import { HotjarProviderService } from './shared/services/hotjar-provider.service';
import { NotifyService } from './shared/services/notify.service';
import { StorageService } from './shared/services/storage.service';
import { entityStoreConfig } from './store/entity-store.config';
import { providePrimeNG } from "primeng/config";
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false
        }
      },
      ripple: true
    }),
    provideAnimationsAsync(),
    provideStore(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
        },
      }
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
      ValdemortModule
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
    StorageService,
    CompanyService,
  ],
};
