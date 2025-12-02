import { type Routes } from '@angular/router';

import { appRoutingNames } from '../../app-routing.names';
import { DebtDataService, IpInfoDataService } from '../../shared/data';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { GtpOutputGuard } from '../../shared/guards/gtp-output.guard';
import {
  DigitalDataService,
  ServiceService,
  ServicesFormsService,
  SettingsStorageService,
} from '../../shared/services';
import { AfiliacionService } from '../../shared/services/afiliacion.service';
import { DynamicDialogService } from '../../shared/services/dynamic-dialog.service';
import { HomeService } from '../../shared/services/home.service';
import { LoadBarService } from '../../shared/services/load-bar.service';
import { LoadFileService } from '../../shared/services/load-file.service';
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
import {
  CompanyConfigurationService,
  CompanyServicesService,
  MovementsService,
  SelectAllTableService,
} from './services';

export const INTERNAL_ROUTES: Routes = [
  {
    path: appRoutingNames.EMPTY,
    component: InternalComponent,
    providers: [
      AfiliacionService,
      DynamicDialogService,
      SettingsStorageService,
    ],
    children: [
      {
        path: internalRoutingNames.HOME,
        component: HomePage,
        canActivate: [AuthGuard, GtpOutputGuard],
        providers: [
          HomeService,
          LoadFileService,
          LoadBarService,
          MovementsService,
          DebtDataService,
          SelectAllTableService,
        ],
      },
      {
        path: internalRoutingNames.COMPANY,
        component: CompanyConfigurationPage,
        resolve: {
          company: CompanyDataResolver,
        },
        canActivate: [AuthGuard, GtpOutputGuard],
        providers: [CompanyDataResolver, CompanyConfigurationService],
      },
      {
        path: internalRoutingNames.SERVICES,
        component: ServicesMainPage,
        resolve: {
          company: CompanyDataResolver,
        },
        providers: [
          CompanyDataResolver,
          CompanyServicesResolver,
          CompanyServicesService,
          ServicesFormsService,
          ServiceService,
          DigitalDataService,
          IpInfoDataService,
        ],
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
