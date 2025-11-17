import { type Routes } from '@angular/router';

import { appRoutingNames } from '../../app-routing.names';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { GtpOutputGuard } from '../../shared/guards/gtp-output.guard';
import { InternalComponent } from './internal.component';
import {
  internalFullRoutingChildNames,
  internalRoutingChildNames,
  internalRoutingNames,
} from './internal-routing.names';
import {
  CompanyConfigurationPage,
  CompanyServicesPage,
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

export const INTERNAL_ROUTES: Routes = [
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
          company: CompanyDataResolver,
        },
        canActivate: [AuthGuard, GtpOutputGuard],
      },
      {
        path: internalRoutingNames.SERVICES,
        component: ServicesMainPage,
        resolve: {
          company: CompanyDataResolver,
        },
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
                path: internalFullRoutingChildNames.SERVICES_ADD_INFO,
                component: ServiceInfoPage,
                resolve: { accounts: CompanyAccountsResolver },
              },
              {
                path: internalFullRoutingChildNames.SERVICES_ADD_CONFIGURATION,
                component: ServiceConfigurationPage,
              },
            ],
          },
        ],
      },
      {
        path: internalRoutingNames.HELP,
        component: HelpPage,
        canActivate: [AuthGuard],
      },
    ],
  },
];
