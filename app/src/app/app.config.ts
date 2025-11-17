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
import { provideStore } from '@ngrx/store';
import { provideState } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Aura from '@primeng/themes/aura';
import { LoggerModule } from 'ngx-logger';
import { ValdemortModule } from 'ngx-valdemort';
import { providePrimeNG } from 'primeng/config';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { LogoutGuard } from './shared/guards/logout.guard';
import { AuthInterceptorService } from './shared/interceptors/auth-interceptor.service';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import { AdobeLaunchProviderService, CompanyService } from './shared/services';
import { EncryptionService } from './shared/services/encryption.service';
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
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
      ripple: true,
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
    StorageService,
    CompanyService,
    LogoutGuard,
  ],
};
