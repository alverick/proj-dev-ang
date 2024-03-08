import { NgModule } from '@angular/core';
import { type Routes, RouterModule } from '@angular/router';

import { appRoutingNames } from '../../app-routing.names';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { GtpInputGuard } from '../../shared/guards/gtp-input.guard';
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

const routes: Routes = [
  {
    path: appRoutingNames.EMPTY,
    component: AdminComponent,
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
