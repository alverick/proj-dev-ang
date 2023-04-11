import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  appFullRoutingNames,
  appRoutingNames,
} from 'src/app/app-routing.names';

import { AuthGuard } from '../../shared/guards/auth.guard';
import { GtpOutputGuard } from '../../shared/guards/gtp-output.guard';
import { CompanyEntriesResolver } from '../../shared/resolvers';
import { InternalComponent } from './internal.component';
import {
  internalFullRoutingChildNames,
  internalRoutingChildNames,
  internalRoutingNames,
} from './internal-routing.names';
import {
  CompanyConfigurationPage,
  CompanyServicesPage,
  DashboardPage,
  HelpPage,
  HomePage,
  ServiceAddPage,
  ServiceConfigurationPage,
  ServiceInfoPage,
  ServicesMainPage,
} from './pages';
import {
  CompanyAccountsResolver,
  CompanyDataResolver,
  CompanyServicesResolver,
} from './resolvers';

const routes: Routes = [
  {
    path: appRoutingNames.EMPTY,
    component: InternalComponent,
    children: [
      {
        path: internalRoutingNames.HOME,
        component: HomePage,
        canActivate: [AuthGuard, GtpOutputGuard],
      },
      {
        path: internalRoutingNames.COMPANY,
        component: CompanyConfigurationPage,
        resolve: {
          entries: CompanyEntriesResolver,
          company: CompanyDataResolver,
        },
        canActivate: [AuthGuard, GtpOutputGuard],
      },
      {
        path: internalRoutingNames.SERVICES,
        component: ServicesMainPage,
        children: [
          {
            path: appRoutingNames.EMPTY,
            component: CompanyServicesPage,
            resolve: { services: CompanyServicesResolver },
          },
          {
            path: internalRoutingChildNames.SERVICES_ADD,
            component: ServiceAddPage,
            children: [
              {
                path: appRoutingNames.EMPTY,
                redirectTo: internalFullRoutingChildNames.SERVICES_ADD_INFO,
                pathMatch: 'full',
              },
              {
                path: internalRoutingChildNames.SERVICES_ADD_INFO,
                component: ServiceInfoPage,
                resolve: { accounts: CompanyAccountsResolver },
              },
              {
                path: internalRoutingChildNames.SERVICES_ADD_CONFIGURATION,
                component: ServiceConfigurationPage,
              },
            ],
          },
        ],
      },
      {
        path: internalRoutingNames.DASHBOARD,
        component: DashboardPage,
        canActivate: [AuthGuard],
      },
      {
        path: internalRoutingNames.HELP,
        component: HelpPage,
        canActivate: [AuthGuard],
      },
      {
        path: appRoutingNames.EMPTY,
        redirectTo: appFullRoutingNames.LANDING,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternalRoutingModule {}
