import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutingNames } from 'src/app/app-routing.collection';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { GtpInputGuard } from '../../shared/guards/gtp-input.guard';
import { SharedModule } from '../../shared/shared.module';
import {
  adminDynamicRoutingNames,
  adminRoutingNames,
} from './admin-routing.names';
import { AdminComponent } from './admin.component';
import { AprobacionesPage } from './pages/aprobaciones/aprobaciones.page';
import { CargaHistoricoComponent } from './pages/carga-historico/carga-historico.component';
import { ConfigurarCorreoGtpComponent } from './pages/configurar-correo-gtp/configurar-correo-gtp.component';
import { GtpGrillaPage } from './pages/gtp-grilla/gtp-grilla.page';

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
        component: AprobacionesPage,
        canActivate: [AuthGuard, GtpInputGuard],
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
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
