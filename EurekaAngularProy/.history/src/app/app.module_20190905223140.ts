import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent} from './pages/home/home.component';
import { AnalisisComponent } from './pages/analisis/analisis.component';
import { SubirPlantillaComponent } from './pages/subir-plantilla/subir-plantilla.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from 'src/app/auth/auth.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RecaptchaModule } from 'ng-recaptcha';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { ExcelService } from './shared/services/excel.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthInterceptorService } from './shared/services/auth-interceptor.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material';
import { AfiliacionService } from './shared/services/afiliacion.service';
import { NumberDirectiveHome } from './pages/home/number.directive';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ValidationComponent } from './pages/home/validation';
import { UploadProgressComponent } from './pages/home/upload-progress';
import { DialogComponent } from './pages/home/dialog';
import { DateDirective } from './pages/home/date.directive';
import { PuntoDirective } from './pages/home/punto.directive';
import { ConfiguracionService } from './shared/services/configuracion.service';
import { ConfigurarEmpresaComponent } from './pages/configurar-empresa/configurar-empresa.component';
import { ShearDirective } from './pages/home/shear.directive';
import { BlockCopyPasteDirective } from './shared/directives/block-copy-paste.directive';
import { DecimalesDirective } from './pages/home/decimales.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EmailDirective } from './pages/configurar-empresa/email.directive';
import { OnlyNumbersDirective } from './pages/configurar-empresa/only-numbers.directive';
import { NotifyService } from './shared/services/notify.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnalisisComponent,
    SubirPlantillaComponent,
    PageNotFoundComponent,
    ValidationComponent,
    NumberDirectiveHome,
    UploadProgressComponent,
    DialogComponent,
    DateDirective,
    PuntoDirective,
    ConfigurarEmpresaComponent,
    ShearDirective,
    BlockCopyPasteDirective,
    DecimalesDirective,
    EmailDirective,
    OnlyNumbersDirective,


    ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AuthModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    NgxSpinnerModule,
    MatInputModule,
    SweetAlert2Module.forRoot(),
    RecaptchaModule.forRoot(),
    DigitOnlyModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressBarModule,
    NgxPaginationModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    SharedModule
  ],
  providers: [
    ExcelService,
     {provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher
      },
      {provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true
      },
      AfiliacionService,
      ConfiguracionService,
      NotifyService

  ],
  exports: [
    MatInputModule,
    MatSnackBarModule,
    ValidationComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent,
                    UploadProgressComponent,
                    ValidationComponent
                    ]
})
export class AppModule { }
