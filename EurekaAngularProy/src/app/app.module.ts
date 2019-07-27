import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent, DialogDataExampleDialog, UploadProgressComponent, ValidationComponent} from './pages/home/home.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AnalisisComponent,
    SubirPlantillaComponent,
    PageNotFoundComponent,
    DialogDataExampleDialog,
    UploadProgressComponent,
    ValidationComponent,
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
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressBarModule,
    NgxPaginationModule,
    MatMomentDateModule,

  ],
  providers: [
    ExcelService,
     {provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher
      },
      {provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true
      }
  ],
  exports: [
    MatInputModule,
    MatSnackBarModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogDataExampleDialog,
                    UploadProgressComponent,
                    ValidationComponent
                    ]
})
export class AppModule { }
