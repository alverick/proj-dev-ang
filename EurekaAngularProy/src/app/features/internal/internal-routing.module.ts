import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  appFullRoutingNames,
  appRoutingNames,
} from 'src/app/app-routing.names';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { GtpOutputGuard } from '../../shared/guards/gtp-output.guard';
import { InternalAuthComponent } from './components/internal-auth/internal-auth.component';
import {
  internalAuthRoutingNames,
  internalRoutingNames,
} from './internal-routing.names';
import { InternalComponent } from './internal.component';
import { CompanyConfigurationPage } from './pages';
import { ConfiguraCobrosParteCuatroComponent } from './pages/configura-cobros-parte-cuatro/configura-cobros-parte-cuatro.component';
import { ConfiguraCobrosParteDosComponent } from './pages/configura-cobros-parte-dos/configura-cobros-parte-dos.component';
import { ConfiguraCobrosParteTresComponent } from './pages/configura-cobros-parte-tres/configura-cobros-parte-tres.component';
import { ConfiguraCobrosParteUnoComponent } from './pages/configura-cobros-parte-uno/configura-cobros-parte-uno.component';
import { EditarCobrosComponent } from './pages/editar-cobros/editar-cobros.component';
import { HelpPage } from './pages/help/help.page';
import { HomePage } from './pages/home/home.page';
import { ResumenCobrosComponent } from './pages/resumen-cobros/resumen-cobros.component';

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
        canActivate: [AuthGuard, GtpOutputGuard],
      },
      {
        path: internalRoutingNames.CHARGES,
        component: ResumenCobrosComponent,
        data: { isEdit: true, affiliationFlow: false },
      },
      {
        path: internalRoutingNames.CHARGES_EDIT,
        component: EditarCobrosComponent,
        data: { isEdit: true, affiliationFlow: false },
      },
      {
        path: internalRoutingNames.CHARGES_ADD_STEP_1,
        component: ConfiguraCobrosParteUnoComponent,
        data: { isEdit: true },
      },
      {
        path: internalRoutingNames.CHARGES_ADD_STEP_2,
        component: ConfiguraCobrosParteDosComponent,
        data: { isEdit: false, affiliationFlow: false },
      },
      {
        path: internalRoutingNames.CHARGES_ADD_STEP_3,
        component: ConfiguraCobrosParteTresComponent,
        data: { isEdit: false, affiliationFlow: false },
      },
      {
        path: internalRoutingNames.CHARGES_ADD_STEP_4,
        component: ConfiguraCobrosParteCuatroComponent,
        data: { isEdit: false, affiliationFlow: false },
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
  {
    path: internalRoutingNames.AUTH,
    component: InternalAuthComponent,
    children: [
      {
        path: internalAuthRoutingNames.CHARGES_AFFILIATION,
        component: ResumenCobrosComponent,
        data: { isEdit: false, affiliationFlow: true },
      },
      {
        path: internalAuthRoutingNames.CHARGES_AFFILIATION_EDIT,
        component: EditarCobrosComponent,
        data: { isEdit: true, affiliationFlow: true },
      },
      {
        path: internalAuthRoutingNames.CHARGES_AFFILIATION_ADD_STEP_1,
        component: ConfiguraCobrosParteUnoComponent,
        data: { isEdit: false },
      },
      {
        path: internalAuthRoutingNames.CHARGES_AFFILIATION_ADD_STEP_2,
        component: ConfiguraCobrosParteDosComponent,
        data: { isEdit: false, affiliationFlow: true },
      },
      {
        path: internalAuthRoutingNames.CHARGES_AFFILIATION_ADD_STEP_3,
        component: ConfiguraCobrosParteTresComponent,
        data: { isEdit: false, affiliationFlow: true },
      },
      {
        path: internalAuthRoutingNames.CHARGES_AFFILIATION_ADD_STEP_4,
        component: ConfiguraCobrosParteCuatroComponent,
        data: { isEdit: false, affiliationFlow: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternalRoutingModule {}
