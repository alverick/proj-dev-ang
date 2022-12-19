import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ApiMockModule } from '@ng-stack/api-mock';
import { RecaptchaModule } from 'ng-recaptcha';
import { CookieService } from 'ngx-cookie-service';
import { LoggerModule } from 'ngx-logger';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmailDirective } from './features/internal/directives/email.directive';
import { DialogComponent } from './features/internal/pages/home/components/dialog';
import { PopoverComponent } from './features/internal/pages/home/components/popover/popover.component';
import { UploadProgressComponent } from './features/internal/pages/home/components/upload-progress';
import { ValidationComponent } from './features/internal/pages/home/components/validation';
import { MockService } from './mock.service';
import { LoadBarComponent } from './shared/components/load-bar/load-bar.component';
import { LoadFileComponent } from './shared/components/load-file/load-file.component';
import { BlockCopyPasteDirective } from './shared/directives/block-copy-paste.directive';
import { AuthGuard } from './shared/guards/auth.guard';
import { CloseViewGuard } from './shared/guards/close-view.guard';
import { LogoutGuard } from './shared/guards/logout.guard';
import { AuthInterceptorService } from './shared/interceptors/auth-interceptor.service';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import { AfiliacionService } from './shared/services/afiliacion.service';
import { ConfiguracionService } from './shared/services/configuracion.service';
import { ExcelService } from './shared/services/excel.service';
import { NotifyService } from './shared/services/notify.service';
import { StorageService } from './shared/services/storage.service';
import { SharedModule } from './shared/shared.module';

const apiMockModule = ApiMockModule.forRoot(MockService, {
  passThruUnknownUrl: true,
  delay: 100,
});

@NgModule({
  declarations: [
    AppComponent,
    BlockCopyPasteDirective,
    EmailDirective,
    DialogComponent,
    UploadProgressComponent,
    ValidationComponent,
    PopoverComponent,
    LoadFileComponent,
    LoadBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MatProgressSpinnerModule,
    PerfectScrollbarModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
      disableConsoleLogging: false,
      enableSourceMaps: true,
    }),
    environment.development ? apiMockModule : [],
    RecaptchaModule,
    SharedModule,
  ],
  providers: [
    ExcelService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
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
    AfiliacionService,
    ConfiguracionService,
    NotifyService,
    StorageService,
    AuthGuard,
    CookieService,
    LogoutGuard,
    CloseViewGuard,
  ],
  exports: [MatInputModule, MatSnackBarModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
