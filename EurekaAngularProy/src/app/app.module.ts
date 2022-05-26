import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatRadioModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  ErrorStateMatcher,
  MatNativeDateModule,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { RecaptchaModule } from 'ng-recaptcha';
import { TooltipModule } from 'ngx-bootstrap';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxPaginationModule } from 'ngx-pagination';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthModule } from 'src/app/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CargaHistoricoComponent } from './auth/carga-historico/carga-historico.component';
import { AnalisisComponent } from './pages/analisis/analisis.component';
import { AprobacionesComponent } from './pages/aprobaciones/aprobaciones.component';
import { ConfigurarEmpresaComponent } from './pages/configurar-empresa/configurar-empresa.component';
import { EmailDirective } from './pages/configurar-empresa/email.directive';
import { OnlyNumbersDirective } from './pages/configurar-empresa/only-numbers.directive';
import { EmpresaGTPComponent } from './pages/empresa-gtp/empresa-gtp.component';
import { GtpGrillaComponent } from './pages/gtp-grilla/gtp-grilla.component';
import { AgregaCobroComponent } from './pages/home/agrega-cobro.component';
import { DateDirective } from './pages/home/date.directive';
import { DebtComponent } from './pages/home/debt.component';
import { DecimalesDirective } from './pages/home/decimales.directive';
import { DialogComponent } from './pages/home/dialog';
import { HomeComponent } from './pages/home/home.component';
import { NumberDirectiveHome } from './pages/home/number.directive';
import { PagosComponent } from './pages/home/pagos/pagos.component';
import { PopoverComponent } from './pages/home/popover/popover.component';
import { PuntoDirective } from './pages/home/punto.directive';
import { ShearDirective } from './pages/home/shear.directive';
import { UploadProgressComponent } from './pages/home/upload-progress';
import { ValidationComponent } from './pages/home/validation';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ServicesGTPComponent } from './pages/services-gtp/services-gtp.component';
import { SubirPlantillaComponent } from './pages/subir-plantilla/subir-plantilla.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { BlockCopyPasteDirective } from './shared/directives/block-copy-paste.directive';
import { HeaderComponent } from './shared/header/header.component';
import { LoadBarComponent } from './shared/load-bar/load-bar.component';
import { LoadFileComponent } from './shared/load-file/load-file.component';
import { AfiliacionService } from './shared/services/afiliacion.service';
import { AuthInterceptorService } from './shared/services/auth-interceptor.service';
import { ConfiguracionService } from './shared/services/configuracion.service';
import { ExcelService } from './shared/services/excel.service';
import { NotifyService } from './shared/services/notify.service';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    GtpGrillaComponent,
    AprobacionesComponent,
    PagosComponent,
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
    EmpresaGTPComponent,
    ServicesGTPComponent,
    PopoverComponent,
    LoadFileComponent,
    LoadBarComponent,
    DebtComponent,
    AgregaCobroComponent,
    CargaHistoricoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatInputModule,
    SweetAlert2Module.forRoot({
      customClass: {
        actions: 'actions-popup',
      },
    }),
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
    PerfectScrollbarModule,
    MaterialFileInputModule,
    MatRadioModule,
    OverlayModule,
    TooltipModule.forRoot(),
  ],
  providers: [
    ExcelService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    AfiliacionService,
    ConfiguracionService,
    NotifyService,
  ],
  exports: [MatInputModule, MatSnackBarModule, ValidationComponent],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogComponent,
    UploadProgressComponent,
    ValidationComponent,
    PagosComponent,
    PopoverComponent,
    LoadFileComponent,
    LoadBarComponent,
    DebtComponent,
    AgregaCobroComponent,
  ],
})
export class AppModule {}
