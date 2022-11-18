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
import { CompanyFormAuthComponent } from './components/company-form-auth/company-form-auth.component';
import { CompanyFormRegistrationComponent } from './components/company-form-registration/company-form-registration.component';
import { FormEmpresaGTPComponent } from './components/form-empresa-gtp/form-empresa-gtp.component';
import { FormServicioGtpComponent } from './components/form-servicio-gtp/form-servicio-gtp.component';
import { FormServicioComponent } from './components/form-servicio/form-servicio.component';
import { SerFormGtpComponent } from './components/ser-form-gtp/ser-form-gtp.component';
import { ServiceDebtFormComponent } from './components/service-debt-form/service-debt-form.component';
import { ServiceEditFormComponent } from './components/service-edit-form/service-edit-form.component';
import { ServiceStepConfigurationComponent } from './components/service-step-configuration/service-step-configuration.component';
import { ServiceStepInfoComponent } from './components/service-step-info/service-step-info.component';
import { SidebarCompanyComponent } from './components/sidebar-company/sidebar-company.component';
import { SidebarServiceComponent } from './components/sidebar-service/sidebar-service.component';
import { DIRECTIVES } from './directives';
import { GUARDS } from './guards';
import { CambiaContrasenaComponent } from './pages/cambia-contrasena/cambia-contrasena.component';
import { CompanyRegistrationAuthPage } from './pages/company-registration-auth/company-registration-auth.page';
import { CompanyRegistrationPage } from './pages/company-registration/company-registration.page';
import { CompletadoPrimeraParteComponent } from './pages/completado-primera-parte/completado-primera-parte.component';
import { ConfigurarGtpComponent } from './pages/configurar-gtp/configurar-gtp.component';
import { ConfigurarServiciosComponent } from './pages/configurar-servicios/configurar-servicios.component';
import { CrearContrasenaComponent } from './pages/crear-contrasena/crear-contrasena.component';
import { LoginPage } from './pages/login/login.page';
import { ProcesandoComponent } from './pages/procesando/procesando.component';
import { RecuperarContrasenaComponent } from './pages/recuperar-contrasena/recuperar-contrasena.component';
import { RegistrationFinishedPage } from './pages/registration-finished/registration-finished.page';
import { ServiceAddPage } from './pages/service-add/service-add.page';
import { ServiceConfigurationPage } from './pages/service-configuration/service-configuration.page';
import { ServiceInfoPage } from './pages/service-info/service-info.page';
import { ServiceResumePage } from './pages/service-resume/service-resume.page';
import { SERVICES } from './services';

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
    ...GUARDS,
    ...SERVICES,
    StorageService,
    AuthGuard,
    CookieService,
    LogoutGuard,
    CloseViewGuard,
  ],
  declarations: [
    CambiaContrasenaComponent,
    CompletadoPrimeraParteComponent,
    CompanyRegistrationAuthPage,
    ConfigurarGtpComponent,
    ConfigurarServiciosComponent,
    CrearContrasenaComponent,
    FormEmpresaGTPComponent,
    FormServicioComponent,
    FormServicioGtpComponent,
    CompanyRegistrationPage,
    LoginPage,
    ProcesandoComponent,
    RecuperarContrasenaComponent,
    SerFormGtpComponent,
    AuthComponent,
    CompanyFormRegistrationComponent,
    CompanyFormAuthComponent,
    ServiceStepInfoComponent,
    ServiceStepConfigurationComponent,
    ServiceDebtFormComponent,
    ServiceEditFormComponent,
    SidebarCompanyComponent,
    ServiceInfoPage,
    ServiceAddPage,
    SidebarServiceComponent,
    ServiceConfigurationPage,
    ServiceResumePage,
    RegistrationFinishedPage,
    ...DIRECTIVES,
  ],
  exports: [
    ServiceDebtFormComponent,
    SidebarCompanyComponent,
    SidebarServiceComponent,
  ],
})
export class AuthModule {}
