import { type Routes } from '@angular/router';

import { appRoutingNames } from '../../app-routing.names';
import { QueryDataService } from '../../shared/data';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { GtpInputGuard } from '../../shared/guards/gtp-input.guard';
import { AfiliacionService } from '../../shared/services/afiliacion.service';
import { ProcessService } from '../../shared/services/process.service';
import { AdminComponent } from './admin.component';
import {
  adminDynamicRoutingNames,
  adminRoutingNames,
} from './admin-routing.names';
import { AprobacionesPage } from './pages/aprobaciones/aprobaciones.page';
import { CargaHistoricoComponent } from './pages/carga-historico/carga-historico.component';
import { ConfigurarCorreoGtpComponent } from './pages/configurar-correo-gtp/configurar-correo-gtp.component';
import { GtpGrillaPage } from './pages/gtp-grilla/gtp-grilla.page';
import { AccountStateDetailsResolver } from './resolvers';

export const ADMIN_ROUTES: Routes = [
  {
    path: appRoutingNames.EMPTY,
    component: AdminComponent,
    providers: [
      AccountStateDetailsResolver,
      AfiliacionService,
      QueryDataService,
      ProcessService,
    ],
    children: [
      {
        path: appRoutingNames.EMPTY,
        component: GtpGrillaPage,
        canActivate: [AuthGuard, GtpInputGuard],
      },
      {
        path: adminDynamicRoutingNames.APPROVE,
        canActivate: [AuthGuard, GtpInputGuard],
        component: AprobacionesPage,
        resolve: {
          stateDetail: AccountStateDetailsResolver,
        },
      },
      {
        path: adminDynamicRoutingNames.HISTORY,
        component: CargaHistoricoComponent,
        canActivate: [AuthGuard, GtpInputGuard],
      },
      {
        path: adminRoutingNames.SETUP_EMAIL,
        component: ConfigurarCorreoGtpComponent,
        canActivate: [AuthGuard, GtpInputGuard],
      },
    ],
  },
];
