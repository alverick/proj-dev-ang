import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { RecaptchaModule } from 'ng-recaptcha';
import { TooltipModule } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CloseViewGuard } from '../shared/guards/close-view.guard';
import { SharedModule } from '../shared/shared.module';
import { LogoutGuard } from './../shared/guards/logout.guard';
import { AfiliacionComponent } from './afiliacion/afiliacion.component';
import { CambiaContrasenaComponent } from './cambia-contrasena/cambia-contrasena.component';
import { ConfigurarCorreoGtpComponent } from './configurar-correo-gtp/configurar-correo-gtp.component';
import { ConfigurarGtpComponent } from './configurar-gtp/configurar-gtp.component';
import { ConfigurarServiciosComponent } from './configurar-servicios/configurar-servicios.component';
import { CrearContrasenaComponent } from './crear-contrasena/crear-contrasena.component';
import { FormEmpresaGTPComponent } from './form-empresa-gtp/form-empresa-gtp.component';
import { FormServicioGtpComponent } from './form-servicio-gtp/form-servicio-gtp.component';
import { FormServicioComponent } from './form-servicio/form-servicio.component';
import { NumberAccountDirective } from './form-servicio/number-account.directive';
import { OnlyNumbersFormDirective } from './form-servicio/only-numbers-form.directive';
import { IdentificarEmpresaComponent } from './identificar-empresa/identificar-empresa.component';
import { LandingComponent } from './landing/landing.component';
import { BlockCopyPasteDirective } from './login/block-copy-paste.directive';
import { LoginComponent } from './login/login.component';
import { ProcesandoComponent } from './procesando/procesando.component';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena.component';
import { SerFormGtpComponent } from './ser-form-gtp/ser-form-gtp.component';
import { CompletarDatosEmpresaComponent } from './completar-datos-empresa/completar-datos-empresa.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    RecaptchaModule,
    DigitOnlyModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    SharedModule,
    MatRadioModule,
    PerfectScrollbarModule,
    TooltipModule.forRoot()
  ],
  providers: [
    StorageService,
    AuthGuard,
    CookieService,
    LogoutGuard,
    CloseViewGuard,
  ],
  declarations: [
    LoginComponent,
    AfiliacionComponent,
    ConfigurarServiciosComponent,
    FormServicioComponent,
    FormEmpresaGTPComponent,
    ProcesandoComponent,
    CrearContrasenaComponent,
    BlockCopyPasteDirective,
    OnlyNumbersFormDirective,
    NumberAccountDirective,
    RecuperarContrasenaComponent,
    CambiaContrasenaComponent,
    FormEmpresaGTPComponent,
    SerFormGtpComponent,
    FormServicioGtpComponent,
    ConfigurarGtpComponent,
    LandingComponent,
    ConfigurarCorreoGtpComponent,
    IdentificarEmpresaComponent,
    IdentificarEmpresaComponent,
    CompletarDatosEmpresaComponent,
  ],
  exports: [
    OnlyNumbersFormDirective
  ]
})

export class AuthModule {
  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
