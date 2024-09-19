import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiMockModule } from '@ng-stack/api-mock';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoggerModule } from 'ngx-logger';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ValdemortModule } from 'ngx-valdemort';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MockService } from './mock.service';
import { FabWhatsappComponent } from './shared/components/fab-whatsapp/fab-whatsapp.component';
import { ValidationDefaultsComponent } from './shared/components/validation-defaults/validation-defaults.component';
import { AuthInterceptorService } from './shared/interceptors/auth-interceptor.service';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import {
  AdobeLaunchProviderService,
  NewRelicProviderService,
} from './shared/services';
import { NotifyService } from './shared/services/notify.service';
import { StorageService } from './shared/services/storage.service';
import { AppConfigEffects } from './store/effects/app-config.effects';
import { appConfigFeature } from './store/reducers/app-config.reducer';

const apiMockModule = ApiMockModule.forRoot(MockService, {
  passThruUnknownUrl: true,
  delay: 100,
});

@NgModule({
  declarations: [
    AppComponent,
    ValidationDefaultsComponent,
    FabWhatsappComponent,
  ],
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
    environment.development ? apiMockModule : [],
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
      }
    ),
    StoreModule.forFeature(appConfigFeature),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([AppConfigEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    connectInZone: true}),
    MatSnackBarModule,
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
    AdobeLaunchProviderService,
    NewRelicProviderService,
    NotifyService,
    StorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
