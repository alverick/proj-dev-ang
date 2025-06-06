import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoggerModule } from 'ngx-logger';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ValdemortModule } from 'ngx-valdemort';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FabWhatsappComponent } from './shared/components/fab-whatsapp/fab-whatsapp.component';
import { ValidationDefaultsComponent } from './shared/components/validation-defaults/validation-defaults.component';
import { AuthInterceptorService } from './shared/interceptors/auth-interceptor.service';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import {
  AdobeLaunchProviderService,
  NewRelicProviderService,
} from './shared/services';
import { EncryptionService } from './shared/services/encryption.service';
import { HotjarProviderService } from './shared/services/hotjar-provider.service';
import { NotifyService } from './shared/services/notify.service';
import { StorageService } from './shared/services/storage.service';
import { AppConfigEffects } from './store/effects/app-config.effects';
import { appConfigFeature } from './store/reducers/app-config.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
      disableConsoleLogging: false,
      enableSourceMaps: true,
    }),
    ValdemortModule,
    StoreModule.forRoot(
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
    StoreModule.forFeature(appConfigFeature),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([AppConfigEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      connectInZone: true,
    }),
    ValidationDefaultsComponent,
    FabWhatsappComponent,
  ],
  providers: [
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
    NewRelicProviderService,
    HotjarProviderService,
    NotifyService,
    StorageService,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
