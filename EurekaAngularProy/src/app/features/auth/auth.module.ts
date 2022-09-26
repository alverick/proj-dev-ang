import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { RecaptchaModule } from 'ng-recaptcha';
import { CookieService } from 'ngx-cookie-service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CloseViewGuard } from '../../shared/guards/close-view.guard';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { CompanyFormRegistrationComponent } from './components/company-form-registration/company-form-registration.component';
import { FormEmpresaGTPComponent } from './components/form-empresa-gtp/form-empresa-gtp.component';
import { FormServicioGtpComponent } from './components/form-servicio-gtp/form-servicio-gtp.component';
import { FormServicioComponent } from './components/form-servicio/form-servicio.component';
import { SerFormGtpComponent } from './components/ser-form-gtp/ser-form-gtp.component';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
import { NumberAccountDirective } from './directives/number-account.directive';
import { OnlyNumbersFormDirective } from './directives/only-numbers-form.directive';
import { CambiaContrasenaComponent } from './pages/cambia-contrasena/cambia-contrasena.component';
import { CompletadoPrimeraParteComponent } from './pages/completado-primera-parte/completado-primera-parte.component';
import { CompletarDatosEmpresaComponent } from './pages/completar-datos-empresa/completar-datos-empresa.component';
import { ConfigurarGtpComponent } from './pages/configurar-gtp/configurar-gtp.component';
import { ConfigurarServiciosComponent } from './pages/configurar-servicios/configurar-servicios.component';
import { CrearContrasenaComponent } from './pages/crear-contrasena/crear-contrasena.component';
import { IdentificarEmpresaPage } from './pages/identificar-empresa/identificar-empresa.page';
import { LoginPage } from './pages/login/login.page';
import { ProcesandoComponent } from './pages/procesando/procesando.component';
import { RecuperarContrasenaComponent } from './pages/recuperar-contrasena/recuperar-contrasena.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    RecaptchaModule,
    DigitOnlyModule,
    SharedModule,
    PerfectScrollbarModule,
  ],
  providers: [
    StorageService,
    AuthGuard,
    CookieService,
    LogoutGuard,
    CloseViewGuard,
  ],
  declarations: [
    BlockCopyPasteDirective,
    CambiaContrasenaComponent,
    CompletadoPrimeraParteComponent,
    CompletarDatosEmpresaComponent,
    ConfigurarGtpComponent,
    ConfigurarServiciosComponent,
    CrearContrasenaComponent,
    FormEmpresaGTPComponent,
    FormServicioComponent,
    FormServicioGtpComponent,
    IdentificarEmpresaPage,
    LoginPage,
    NumberAccountDirective,
    OnlyNumbersFormDirective,
    ProcesandoComponent,
    RecuperarContrasenaComponent,
    SerFormGtpComponent,
    AuthComponent,
    CompanyFormRegistrationComponent,
  ],
  exports: [OnlyNumbersFormDirective],
})
export class AuthModule {}
