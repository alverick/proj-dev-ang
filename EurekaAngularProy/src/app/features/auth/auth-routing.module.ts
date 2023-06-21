import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  appRoutingNames,
  authFullRoutingNames,
} from '../../app-routing.collection';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import { CompanyEntriesResolver } from '../../shared/resolvers';
import { AuthComponent } from './auth.component';
import {
  authDynamicRoutingNames,
  authFullRoutingChildNames,
  authRoutingChildNames,
  authRoutingNames,
} from './auth-routing.names';
import {
  AffiliationCompanyIdGuard,
  AffiliationExitGuard,
  AffiliationFinishedGuard,
  AffiliationResumeExitGuard,
  AffiliationRucGuard,
  AffiliationServiceValidGuard,
  AffiliationUpdatingGuard,
  ValidateTokenGuard,
} from './guards';
import {
  CambiaContrasenaComponent,
  CompanyRegistrationAuthPage,
  CompanyRegistrationPage,
  LoginPage,
  ProcessingUpdatePage,
  RecuperarContrasenaComponent,
  RegistrationFinishedPage,
  RegistrationUpdatePage,
  ServiceAddPage,
  ServiceConfigurationPage,
  ServiceInfoPage,
  ServiceResumePage,
  UpdateCompanyPage,
  UpdateServicesPage,
} from './pages';

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
        path: authRoutingNames.PROCESSING,
        component: ProcessingUpdatePage,
        canActivate: [LogoutGuard],
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
        canActivate: [AffiliationFinishedGuard],
      },
      {
        path: authDynamicRoutingNames.REGISTER_UPDATING_VALIDATION,
        component: RegistrationUpdatePage,
        canActivate: [ValidateTokenGuard],
      },
      {
        path: authRoutingNames.REGISTER_UPDATING,
        component: RegistrationUpdatePage,
        canActivateChild: [AffiliationUpdatingGuard],
        children: [
          {
            path: appRoutingNames.EMPTY,
            redirectTo: authFullRoutingChildNames.UPDATE_COMPANY,
            pathMatch: 'full',
          },
          {
            path: authRoutingChildNames.UPDATE_COMPANY,
            component: UpdateCompanyPage,
            resolve: {
              entries: CompanyEntriesResolver,
            },
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
