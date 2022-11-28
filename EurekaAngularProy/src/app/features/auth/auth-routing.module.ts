import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  appRoutingNames,
  authFullRoutingNames,
} from 'src/app/app-routing.collection';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ClientGuard } from '../../shared/guards/client.guard';
import { GtpInputGuard } from '../../shared/guards/gtp-input.guard';
import { GtpOutputGuard } from '../../shared/guards/gtp-output.guard';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import {
  authDynamicRoutingNames,
  authFullRoutingChildNames,
  authRoutingChildNames,
  authRoutingNames,
} from './auth-routing.names';
import { AuthComponent } from './auth.component';
import {
  AffiliationCompanyIdGuard,
  AffiliationExitGuard,
  AffiliationResumeExitGuard,
  AffiliationRucGuard,
  AffiliationServiceValidGuard,
  ValidateTokenGuard,
} from './guards';
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
import { RegistrationUpdatePage } from './pages/registration-update/registration-update.page';
import { ServiceAddPage } from './pages/service-add/service-add.page';
import { ServiceConfigurationPage } from './pages/service-configuration/service-configuration.page';
import { ServiceInfoPage } from './pages/service-info/service-info.page';
import { ServiceResumePage } from './pages/service-resume/service-resume.page';
import { UpdateCompanyPage } from './pages/update-company/update-company.page';
import { UpdateServicesPage } from './pages/update-services/update-services.page';

const routes: Routes = [
  {
    path: appRoutingNames.EMPTY,
    component: AuthComponent,
    children: [
      {
        path: appRoutingNames.EMPTY,
        redirectTo: authFullRoutingNames.LOGIN,
        pathMatch: 'full',
      },
      {
        path: authRoutingNames.SERVICES_EDIT_GTP,
        component: ConfigurarServiciosComponent,
        data: { isgtp: true },
      },
      {
        path: authRoutingNames.SERVICES_CONFIGURE,
        component: ConfigurarServiciosComponent,
        data: { isEdit: false },
        canActivate: [ClientGuard],
      },
      {
        path: authRoutingNames.SERVICES_EDIT,
        component: ConfigurarServiciosComponent,
        data: { isEdit: true },
        canActivate: [AuthGuard, GtpOutputGuard],
      },
      {
        path: authRoutingNames.CONFIGURATION,
        component: ConfigurarServiciosComponent,
      },
      {
        path: authRoutingNames.GENERATE_PASSWORD,
        component: CrearContrasenaComponent,
        data: { isEdit: false },
      },
      {
        path: authDynamicRoutingNames.GENERATE_PASSWORD,
        component: CrearContrasenaComponent,
        data: { isEdit: true },
      },
      {
        path: authRoutingNames.COMPANY_FINISHED,
        component: CompletadoPrimeraParteComponent,
        data: { isEdit: false },
      },
      {
        path: authRoutingNames.PROCESSING,
        component: ProcesandoComponent,
        canActivate: [LogoutGuard],
      },
      {
        path: authDynamicRoutingNames.COMPANY_CONFIGURATION,
        component: ConfigurarGtpComponent,
        data: { isEdit: true },
        canActivate: [AuthGuard, GtpInputGuard],
      },
      {
        path: authRoutingNames.COMPANY_CONFIGURATION,
        component: ConfigurarGtpComponent,
      },
      {
        path: authRoutingNames.COMPANY_REGISTER,
        component: CompanyRegistrationPage,
      },
      {
        path: authRoutingNames.COMPANY_FILL_DATA,
        component: CompanyRegistrationAuthPage,
        canActivate: [AffiliationRucGuard],
      },
      {
        path: authRoutingNames.SERVICES_ADD,
        component: ServiceAddPage,
        canDeactivate: [AffiliationExitGuard],
        canActivateChild: [AffiliationCompanyIdGuard],
        children: [
          {
            path: appRoutingNames.EMPTY,
            redirectTo: authFullRoutingChildNames.SERVICES_ADD_INFO,
            pathMatch: 'full',
          },
          {
            path: authRoutingChildNames.SERVICES_ADD_INFO,
            component: ServiceInfoPage,
          },
          {
            path: authRoutingChildNames.SERVICES_ADD_CONFIGURATION,
            component: ServiceConfigurationPage,
            canActivate: [AffiliationServiceValidGuard],
          },
          {
            path: authRoutingChildNames.SERVICES_ADD_LIST,
            component: ServiceResumePage,
            canDeactivate: [AffiliationResumeExitGuard],
          },
        ],
      },
      {
        path: authRoutingNames.REGISTRATION_FINISHED,
        component: RegistrationFinishedPage,
      },
      {
        path: authDynamicRoutingNames.REGISTER_UPDATING_VALIDATION,
        component: RegistrationUpdatePage,
        canActivate: [ValidateTokenGuard],
      },
      {
        path: authRoutingNames.REGISTER_UPDATING,
        component: RegistrationUpdatePage,
        children: [
          {
            path: appRoutingNames.EMPTY,
            redirectTo: authFullRoutingChildNames.UPDATE_COMPANY,
            pathMatch: 'full',
          },
          {
            path: authRoutingChildNames.UPDATE_COMPANY,
            component: UpdateCompanyPage,
          },
          {
            path: authRoutingChildNames.UPDATE_SERVICES,
            component: UpdateServicesPage,
          },
        ],
      },
    ],
  },
  {
    path: authRoutingNames.RECOVER_PASSWORD,
    component: RecuperarContrasenaComponent,
    canActivate: [LogoutGuard],
  },
  {
    path: authDynamicRoutingNames.CHANGE_PASSWORD,
    component: CambiaContrasenaComponent,
    canActivate: [LogoutGuard],
  },
  {
    path: authRoutingNames.LOGIN,
    component: LoginPage,
    canActivate: [LogoutGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
